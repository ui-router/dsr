# Deep State Redirect

### DSR for UI-Router 1.0 &nbsp;[![Build Status](https://github.com/ui-router/dsr/workflows/CI:%20Deep%20State%20Redirect%20for%20UIRouter/badge.svg)](https://github.com/ui-router/dsr/actions?query=workflow%3A%22CI%3A+Deep+State+Redirect+for+UIRouter%22)

With Deep State Redirect, a parent state remembers whatever child state was last activated.
When the user directly reactivates the parent state, they are redirected to the nested state (which was previously activated).

## Overview and Use Case

Deep State Redirect (DSR) is a marker you can add to a state definition.

When a child state of the DSR marked state is activated, UI-Router Extras remembers the child and its parameters.
The most-recently-activate child is remembered no matter where the user navigates in the state tree.
When the DSR marked state is directly activated, UI-Router Extras will redirect to the remembered child state and parameters.

One use case for DSR is a tabbed application.
Each tab might contain an application module.
Each tabs' state is marked as deepStateRedirect.
When the user navigates into the tab, and drills down to a substate, DSR will remember the substate.
The user can then navigate to other tabs (or somewhere else completely).
When they click the original tab again, it will transition to the remembered ehild state and parameters of that tab, making it appear that the tab was never destructed.

Deep State Redirect can be used with StickyStates, or on its own.
If used with a Sticky State, the states will be reactivated, and the DOM will be unchanged (as opposed to the states being re-entered and controllers re-initialized)

## Using

See: http://christopherthielen.github.io/ui-router-extras/#/dsr

TODO: Move docs here

### Using a custom DataStore

By default DSR stores the most recent redirects in memory.
Alternatively, you can store the redirects in Local Storage using
[LocalStorageDataStore](https://github.com/ui-router/dsr/blob/master/src/DSRDataStore.ts)
or create your own DataStore.

When registering the DSRPlugin, pass an options object with a `dataStore` property, i.e.:

```js
router.plugin(DSRPlugin, { dataStore: new LocalStorageDataStore() });
```

## Example Builds

The [`/examples` directory](https://github.com/ui-router/dsr/tree/master/examples) contains example setups for:

- Angular-CLI
- AngularJS + bower + script tags
- AngularJS + npm + script tags
- AngularJS + webpack
- Create-React-App
