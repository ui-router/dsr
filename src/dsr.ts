import {
  StateObject, StateDeclaration, Param, UIRouter, RawParams, StateOrName, TargetState, Transition, UIRouterPlugin,
  TransitionOptions, TransitionService, StateService
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

export interface DSRConfig {
  default?: TargetState;
  params?: ParamPredicate;
  fn?: (transition: Transition, something: any) => any;
}

export interface RecordedDSR {
  target: TargetState;
  triggerParams: object;
}

class DSRPlugin implements UIRouterPlugin {
  name = 'deep-state-redirect';

  $transitions: TransitionService;
  $state: StateService;
  hookDeregFns = [];

  constructor($uiRouter: UIRouter) {
    this.$transitions = $uiRouter.transitionService;
    this.$state = $uiRouter.stateService;

    this.hookDeregFns.push(this.$transitions.onRetain({ retained: state => !!this.getDsrProp(state.self) }, this.recordDeepState.bind(this)));
    this.hookDeregFns.push(this.$transitions.onEnter({ entering: state => !!this.getDsrProp(state.self) }, this.recordDeepState.bind(this)));
    this.hookDeregFns.push(this.$transitions.onBefore({ to: state => !!this.getDsrProp(state.self) }, this.deepStateRedirect.bind(this)));
  }

  dispose(router: UIRouter): void {
    this.hookDeregFns.forEach(fn => fn());
  }

  reset(state: StateOrName, params?: RawParams): void {
    const { $state } = this;
    if (!state) {
      $state.get().forEach(state => delete state.$$state().$dsr);
    } else if (!params) {
      delete $state.get(state).$$state().$dsr;
    } else {
      const $$state = $state.get(state).$$state();
      $$state.$dsr = ($$state.$dsr as RecordedDSR[]).filter(this.paramsEqual($$state, params, undefined, true));
    }
  }

  getRedirect(state: StateOrName, params?: RawParams): TargetState {
    return this.getDeepStateRedirect(state, params);
  }

  private getDsrProp(state: StateDeclaration): DSRProp {
    return state.deepStateRedirect || state.dsr;
  }

  private getConfig(state: StateDeclaration): DSRConfig {
    const { $state } = this;
    const dsrProp: DSRProp = this.getDsrProp(state);
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

  private paramsEqual(state: StateObject,
                      transParams: RawParams,
                      paramPredicate: ParamPredicate = () => true,
                      negate = false,
  ): (redirect: RecordedDSR) => boolean {
    const schema = state.parameters({ inherit: true }).filter(paramPredicate);

    return (redirect: RecordedDSR) => {
      const equals = Param.equals(schema, redirect.triggerParams, transParams);
      return negate ? !equals : equals;
    }
  }

  private recordDeepState(transition: Transition, state: StateDeclaration): void {
    const { $state } = this;
    const paramsConfig = this.getConfig(state).params;
    const _state = state.$$state();

    transition.promise.then( () => {
      const transTo = transition.to();
      const transParams = transition.params();
      const recordedDsrTarget = $state.target(transTo, transParams);

      if (paramsConfig) {
        const recordedDSR = (_state.$dsr as RecordedDSR[]) || [];
        const predicate = this.paramsEqual(transTo.$$state(), transParams, undefined, true);
        _state.$dsr = recordedDSR.filter(predicate);
        _state.$dsr.push({ triggerParams: transParams, target: recordedDsrTarget });
      } else {
        _state.$dsr = recordedDsrTarget;
      }
    });
  }

  private deepStateRedirect(transition: Transition) {
    let opts = transition.options();
    if (opts['ignoreDsr'] || (opts.custom && opts.custom.ignoreDsr)) return;

    let config = this.getConfig(transition.to());
    let redirect = this.getDeepStateRedirect(transition.to(), transition.params());
    redirect = config.fn(transition, redirect);
    if (redirect && redirect.state() === transition.to()) return;

    return redirect;
  }

  private getDeepStateRedirect(stateOrName: StateOrName, params: RawParams): TargetState {
    const { $state } = this;
    const _state = $state.get(stateOrName);
    const state = _state && _state.$$state();
    const config: DSRConfig = this.getConfig(_state);
    let dsrTarget: TargetState;

    if (config.params) {
      const predicate = this.paramsEqual(state, params, config.params, false);
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
}

export { DSRPlugin };
