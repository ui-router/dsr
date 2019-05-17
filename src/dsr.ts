import {
  StateObject,
  StateDeclaration,
  Param,
  UIRouter,
  RawParams,
  StateOrName,
  TargetState,
  Transition,
  UIRouterPlugin,
  TransitionService,
  StateService,
} from '@uirouter/core';

import { DSRDataStore, StateObjectDataStore } from './DSRDataStore';
import { _DSRConfig, DSRConfigObj, DSRFunction, DSRProp, ParamPredicate, RecordedDSR } from './interface';

class DSRPlugin implements UIRouterPlugin {
  name = 'deep-state-redirect';

  dataStore: DSRDataStore;
  $transitions: TransitionService;
  $state: StateService;
  hookDeregFns = [];

  constructor($uiRouter: UIRouter, options: { dataStore: DSRDataStore }) {
    this.$transitions = $uiRouter.transitionService;
    this.$state = $uiRouter.stateService;
    this.dataStore = (options && options.dataStore) || new StateObjectDataStore();
    this.dataStore.init($uiRouter);

    this.hookDeregFns.push(
      this.$transitions.onRetain({ retained: state => !!this.getDsrProp(state.self) }, this.recordDeepState.bind(this))
    );
    this.hookDeregFns.push(
      this.$transitions.onEnter({ entering: state => !!this.getDsrProp(state.self) }, this.recordDeepState.bind(this))
    );
    this.hookDeregFns.push(
      this.$transitions.onBefore({ to: state => !!this.getDsrProp(state.self) }, this.deepStateRedirect.bind(this))
    );
  }

  dispose(router: UIRouter): void {
    this.hookDeregFns.forEach(fn => fn());
  }

  /**
   * Resets deep state redirect
   *
   * A deep state is recorded for each DSR state.
   * This function resets recorded deep state redirect(s) to the initial value.
   *
   * If called with no parameters, the redirects for all states are reset.
   *
   * If called with a `state` parameter, the redirect for that state is reset.
   *
   * If called with `state` and `params` parameters, the redirect for that state and set of parameter values is reset.
   *
   * @param state (optional) the redirect for this state will be reset
   * @param params (optional) the redirect for the state and parameters will be reset
   */
  reset(state?: StateOrName, params?: RawParams): void {
    const { $state } = this;
    if (!state) {
      $state.get().forEach(_state => this.dataStore.set(_state, undefined));
    } else if (!params) {
      this.dataStore.set(state, undefined);
    } else {
      const currentDSRS = this.dataStore.get(state);
      const $$state = $state.get(state).$$state();
      this.dataStore.set(state, currentDSRS.filter(this.paramsEqual($$state, params, undefined, true)));
    }
  }

  /**
   * Returns the recorded redirect
   *
   * Returns the recorded redirect for a given DSR `state` (and optionally `params`).
   *
   * @param state the DSR state
   * @param params (optional) the parameter values
   *
   * @returns the recorded redirect `TargetState`
   */
  getRedirect(state: StateOrName, params?: RawParams): TargetState {
    return this.getDeepStateRedirect(state, params);
  }

  private getDsrProp(state: StateDeclaration): DSRProp {
    return state.deepStateRedirect || state.dsr;
  }

  public getConfig(state: StateDeclaration): _DSRConfig {
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
        params = () => true;
      } else if (Array.isArray(paramsProp)) {
        params = (param: Param) => paramsProp.indexOf(param.id) !== -1;
      }
    }

    fn = fn || (((transition: Transition, target: TargetState) => target) as DSRFunction);

    return { default: defaultTarget, params, fn };
  }

  public paramsEqual(
    state: StateObject,
    transParams: RawParams,
    paramPredicate: ParamPredicate = () => true,
    negate = false
  ): (redirect: RecordedDSR) => boolean {
    const schema = state.parameters({ inherit: true }).filter(paramPredicate);

    return (redirect: RecordedDSR) => {
      const equals = Param.equals(schema, redirect.triggerParams, transParams);
      return negate ? !equals : equals;
    };
  }

  private recordDeepState(transition: Transition, state: StateDeclaration): void {
    const { $state } = this;
    const hasParamsConfig: boolean = !!this.getConfig(state).params;
    const _state: StateObject = state.$$state();

    transition.promise.then(() => {
      const transTo = transition.to();
      const triggerParams = transition.params();
      const target: TargetState = $state.target(transTo, triggerParams);
      const targetStateName = target.name();
      const targetParams = target.params();
      const recordedDSR: RecordedDSR = { triggerParams, targetStateName, targetParams };

      if (hasParamsConfig) {
        const currentDSRS: RecordedDSR[] = this.dataStore.get(_state);
        const predicate = this.paramsEqual(transTo.$$state(), triggerParams, this.getConfig(state).params, true);
        const updatedDSRS = currentDSRS.filter(predicate).concat(recordedDSR);
        this.dataStore.set(_state, updatedDSRS);
      } else {
        this.dataStore.set(_state, [recordedDSR]);
      }
    });
  }

  private deepStateRedirect(transition: Transition): TargetState | undefined {
    const opts = transition.options();
    if (opts['ignoreDsr'] || (opts.custom && opts.custom.ignoreDsr)) return;

    const config: _DSRConfig = this.getConfig(transition.to());
    let redirect: TargetState = this.getDeepStateRedirect(transition.to(), transition.params());

    redirect = config.fn(transition, redirect);

    if (redirect && redirect.state() === transition.to()) return;

    return redirect;
  }

  private getTargetState(dsr: RecordedDSR): TargetState {
    return this.$state.target(dsr.targetStateName, dsr.targetParams);
  }

  private getDeepStateRedirect(stateOrName: StateOrName, params: RawParams): TargetState {
    const { $state } = this;
    const _state = $state.get(stateOrName);
    const state = _state && _state.$$state();
    const config: _DSRConfig = this.getConfig(_state);
    const currentDSRS = this.dataStore.get(stateOrName);
    let recordedDSR: RecordedDSR;

    if (config.params) {
      const predicate = this.paramsEqual(state, params, config.params, false);
      const match = currentDSRS.find(predicate);
      recordedDSR = match && match;
    } else {
      recordedDSR = currentDSRS[0] && currentDSRS[0];
    }

    let dsrTarget = recordedDSR ? this.getTargetState(recordedDSR) : config.default;

    if (dsrTarget) {
      // merge original params with deep state redirect params
      const targetParams = Object.assign({}, params, dsrTarget.params());
      dsrTarget = $state.target(dsrTarget.state(), targetParams, dsrTarget.options());
    }

    return dsrTarget;
  }
}

export { DSRPlugin };
