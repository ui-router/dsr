import { StateOrName, UIRouter } from '@uirouter/core';
import { RecordedDSR } from './interface';

export interface DSRDataStore {
  init(router: UIRouter): void;
  // Gets the remembered DSR target state for a given state and params
  get(state: StateOrName): RecordedDSR[];
  // Sets the remembered DSR target state for a given state and params
  set(state: StateOrName, recordedDSR: RecordedDSR[] | undefined): void;
}

export class StateObjectDataStore implements DSRDataStore {
  private router: UIRouter;

  private getState(stateOrName: StateOrName) {
    const state = this.router.stateService.get(stateOrName);
    return state && state.$$state();
  }

  public init(router: UIRouter): void {
    this.router = router;
  }

  public get(stateOrName: StateOrName): RecordedDSR[] {
    return this.getState(stateOrName).$dsr || [];
  }

  public set(stateOrName: StateOrName, recordedDsr: RecordedDSR[]): void {
    const state = this.getState(stateOrName);
    if (recordedDsr) {
      state.$dsr = recordedDsr;
    } else {
      delete state.$dsr;
    }
  }
}

export class LocalStorageDataStore implements DSRDataStore {
  private router: UIRouter;
  private key = 'uiRouterDeepStateRedirect';

  private getStore() {
    const item = localStorage.getItem(this.key);
    return JSON.parse(item || '{}');
  }

  private setStore(contents: any) {
    if (contents) {
      try {
        localStorage.setItem(this.key, JSON.stringify(contents));
      } catch (err) {
        console.error(
          'UI-Router Deep State Redirect: cannot store object in LocalStorage.  Is there a circular reference?',
          contents
        );
        console.error(err);
      }
    } else {
      localStorage.removeItem(this.key);
    }
  }

  private getStateName(stateOrName: StateOrName) {
    const state = this.router.stateService.get(stateOrName);
    return state && state.name;
  }

  public init(router: UIRouter): void {
    this.router = router;
  }

  public get(stateOrName: StateOrName): RecordedDSR[] {
    const stateName = this.getStateName(stateOrName);
    const store = this.getStore();
    return store[stateName] || [];
  }

  public set(stateOrName: StateOrName, recordedDsr: RecordedDSR[]): void {
    const stateName = this.getStateName(stateOrName);
    const store = this.getStore();
    store[stateName] = recordedDsr;
    this.setStore(store);
  }
}
