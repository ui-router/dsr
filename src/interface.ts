import { Param, RawParams, StateOrName, TargetState, Transition, TransitionOptions } from '@uirouter/core';

declare module '@uirouter/core/lib/state/interface' {
  interface StateDeclaration {
    dsr?: DSRProp;
    deepStateRedirect?: DSRProp;
  }
}

declare module '@uirouter/core/lib/state/stateObject' {
  interface StateObject {
    $dsr: RecordedDSR[];
  }
}

export type ParamPredicate = (param: Param) => boolean;
export type DSRProp = boolean | string | DSRFunction | DSRConfigObj;
export type DSRFunction = (...args) => boolean | DSRTarget;
export interface DSRTarget {
  state?: StateOrName;
  params?: RawParams;
  options?: TransitionOptions;
}

export interface DSRConfigObj {
  default?: string | DSRTarget;
  params?: boolean | string[];
  fn?: DSRFunction;
}

export interface _DSRConfig {
  default?: TargetState;
  params?: ParamPredicate;
  fn?: (transition: Transition, something: any) => any;
}

export interface RecordedDSR {
  targetStateName: string;
  targetParams: RawParams;
  triggerParams: object;
}
