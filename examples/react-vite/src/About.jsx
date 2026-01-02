import * as React from 'react';
import { UISref } from '@uirouter/react';

export class About extends React.Component {
  render() {
    return (
      <div>
        <h1>This is a trivial Deep State Redirect example app</h1>
        <ol>
          <li>
            {' '}
            Active the{' '}
            <UISref to="continentlist">
              <a>continentlist</a>
            </UISref>{' '}
            state
          </li>
          <li> Select a continent</li>
          <li> Select a country</li>
          <li>
            {' '}
            Reactivate this state (
            <UISref to="about">
              <a>about</a>
            </UISref>
            )
          </li>
          <li>
            Active the{' '}
            <UISref to="continents">
              <a>continents</a>
            </UISref>{' '}
            state again.
            <br />
            You are redirected to the previously active substate of
            <code>continentlist</code> (including parameters).
            <br />
            You should see the country you chose in the previous step.
          </li>
        </ol>
      </div>
    );
  }
}
