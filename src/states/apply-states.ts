import {Ng1StateDeclaration, StateProvider} from 'angular-ui-router';
import {getMetadata, NgmsComponent} from 'ng-metasys';
import {Hooks} from '../hooks/hooks';
import {StateDeclaration} from './state-declaration';

type ApplyStates =
  (ngModule: angular.IModule, states: StateDeclaration[], hooks?: Map<any, Hooks>) => void;

const applyStates: ApplyStates =
  (ngModule, states, hooks) => {
    ngModule.config(['$stateProvider', ($stateProvider: StateProvider) => {
      for (let i = 0, len = states.length; i < len; i++) {
        const state = states[i];
        const component = state.component;

        if (!component) {
          $stateProvider.state(state as Ng1StateDeclaration);
          continue;
        }

        const metadata = getMetadata(component) as NgmsComponent;

        let componentHooks: Hooks|undefined;

        if (hooks) {
          componentHooks = hooks.get(component);
        }

        $stateProvider.state({
          ...state,
          component: metadata.name,
          ...componentHooks
        });
      }
    }]);
  };

export {ApplyStates};
export default applyStates;
