import { APP_MODULE } from './app.module';
APP_MODULE.component('about', {
  template: `
    <h1>This is a trivial Deep State Redirect example app</h1>
    <ol>
      <li> Active the <a ui-sref="continentlist">continentlist</a> state</li>
      <li> Select a continent </li>
      <li> Select a country </li>
      <li> Reactivate this state (<a ui-sref="about">about</a>)</li>
      <li>
        Active the <a ui-sref="continents">continents</a> state again.<br>
        You are redirected to the previously active substate of <code>continentlist</code> (including parameters).<br>
        You should see the country you chose in the previous step.
      </li>
    </ol>
  `,
});

