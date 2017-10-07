import {
  StateObject, StateDeclaration, Param, UIRouter, RawParams, StateOrName, TargetState, Transition, UIRouterPlugin,
  TransitionOptions
} from "@uirouter/core";

declare module "@uirouter/core/lib/state/interface" {
  interface StateDeclaration {
    dsr?: DSRProp;
    deepStateRedirect?: DSRProp;
  }
}

declare module "@uirouter/core/lib/state/stateObject" {
  interface StateObject {
    $dsr: TargetState | RecordedDSR[]
  }
}

export type ParamPredicate = (param: Param) => boolean;
export type DSRProp = boolean | string | DSRFunction | DSRConfigObj;
export type DSRFunction = (...args) => boolean | DSRTarget;
export interface DSRTarget {
  state?: StateOrName;
  params?: RawParams;
  options?: TransitionOptions
}

export interface DSRConfigObj {
  default?: string | DSRTarget;
  params?: boolean | string[];
  fn?: DSRFunction;
}

interface DSRConfig {
  default?: TargetState;
  params?: ParamPredicate;
  fn?: (transition: Transition, something: any) => any;
}

export interface RecordedDSR {
  target: TargetState;
  triggerParams: object;
}

export interface IDSRPlugin extends UIRouterPlugin {
  reset(state: StateOrName, params?: RawParams): void;
  getRedirect(state: StateOrName, params?: RawParams): TargetState;
}

function DSRPlugin($uiRouter: UIRouter): IDSRPlugin {
  const $transitions = $uiRouter.transitionService;
  const $state = $uiRouter.stateService;

  $transitions.onRetain({ retained: state => !!getDsrProp(state.self) }, recordDeepState);
  $transitions.onEnter({ entering: state => !!getDsrProp(state.self) }, recordDeepState);
  $transitions.onBefore({ to: state => !!getDsrProp(state.self) }, deepStateRedirect);

  function getDsrProp(state: StateDeclaration): DSRProp {
    return state.deepStateRedirect || state.dsr;
  }

  function getConfig(state: StateDeclaration): DSRConfig {
    const dsrProp: DSRProp = getDsrProp(state);
    if (typeof dsrProp === 'undefined') return;

    let params: ParamPredicate;
    let defaultTarget: TargetState = typeof dsrProp === 'string' ? $state.target(dsrProp) : undefined;
    let fn: DSRFunction = typeof dsrProp === 'function' ? dsrProp : undefined;

    if (typeof dsrProp === 'object') {
      fn = dsrProp.fn;
      if (typeof dsrProp.default === 'object') {
        defaultTarget = $state.target(dsrProp.default.state, dsrProp.default.params, dsrProp.default.options);
      } else if (typeof dsrProp.default === 'string') {
        defaultTarget = $state.target(dsrProp.default);
      }

      const paramsProp = (dsrProp as DSRConfigObj).params;

      if (paramsProp === true) {
        params = () => true
      } else if (Array.isArray(paramsProp)) {
        params = (param: Param) => paramsProp.indexOf(param.id) !== -1;
      }
    }

    fn = fn || ((transition: Transition, target: TargetState) => target);

    return { default: defaultTarget, params, fn };
  }

  function paramsEqual(
      state: StateObject,
      transParams: RawParams,
      paramPredicate: ParamPredicate = () => true,
      negate = false,
  ): (redirect: any) => boolean {
    const schema = state.parameters({ inherit: true }).filter(paramPredicate);

    return function (redirect) {
      const equals = Param.equals(schema, redirect.triggerParams, transParams);
      return negate ? !equals : equals;
    }
  }

  function recordDeepState(transition: Transition, state: StateDeclaration): void {
    const paramsConfig = getConfig(state).params;
    const _state = state.$$state();

    transition.promise.then(function () {
      const transTo = transition.to();
      const transParams = transition.params();
      const recordedDsrTarget = $state.target(transTo, transParams);

      if (paramsConfig) {
        const recordedDSR = (_state.$dsr as RecordedDSR[]) || [];
        const predicate = paramsEqual(transTo.$$state(), transParams, undefined, true);
        _state.$dsr = recordedDSR.filter(predicate);
        _state.$dsr.push({ triggerParams: transParams, target: recordedDsrTarget });
      } else {
        _state.$dsr = recordedDsrTarget;
      }
    });
  }

  function deepStateRedirect(transition: Transition) {
    let opts = transition.options();
    if (opts['ignoreDsr'] || (opts.custom && opts.custom.ignoreDsr)) return;

    let config = getConfig(transition.to());
    let redirect = getDeepStateRedirect(transition.to(), transition.params());
    redirect = config.fn(transition, redirect);
    if (redirect && redirect.state() === transition.to()) return;

    return redirect;
  }

  function getDeepStateRedirect(stateOrName: StateOrName, params: RawParams): TargetState {
    const _state = $state.get(stateOrName);
    const state = _state && _state.$$state();
    const config: DSRConfig = getConfig(_state);
    let dsrTarget: TargetState;

    if (config.params) {
      const predicate = paramsEqual(state, params, config.params, false);
      const match = state.$dsr && (state.$dsr as RecordedDSR[]).filter(predicate)[0];
      dsrTarget = match && match.target;
    } else {
      dsrTarget = state.$dsr as TargetState;
    }

    dsrTarget = dsrTarget || config.default;

    if (dsrTarget) {
      // merge original params with deep state redirect params
      let targetParams = Object.assign({}, params, dsrTarget.params());
      dsrTarget = $state.target(dsrTarget.state(), targetParams, dsrTarget.options());
    }

    return dsrTarget;
  }

  return {
    name: 'deep-state-redirect',

    dispose() {},

    reset: function(state: StateOrName, params?: RawParams) {
      if (!state) {
        $state.get().forEach(state => delete state.$$state().$dsr);
      } else if (!params) {
        delete $state.get(state).$$state().$dsr;
      } else {
        const $$state = $state.get(state).$$state();
        $$state.$dsr = ($$state.$dsr as RecordedDSR[]).filter(paramsEqual($$state, params, undefined, true));
      }
    },

    getRedirect: function (state: StateOrName, params?: RawParams) {
      return getDeepStateRedirect(state, params);
    },
  };
}

export { DSRPlugin };
