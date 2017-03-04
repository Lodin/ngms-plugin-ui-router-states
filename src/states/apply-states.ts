import {Ng1StateDeclaration, StateProvider} from 'angular-ui-router';
import {getMetadata, isComponent, NgmsComponent} from 'ng-metasys';
import {StateDeclaration} from './state-declaration';

type MapToRouterState = (states: StateDeclaration[]) => Ng1StateDeclaration[];
const mapToRouterState: MapToRouterState =
  states => {
    const len = states.length;
    const result = new Array<Ng1StateDeclaration>(len);

    for (let i = 0; i < len; i++) {
      const state = states[i];
      const component = state.component;

      if (!component) {
        result[i] = state as Ng1StateDeclaration;
        continue;
      }

      if (!isComponent(component)) {
        throw new Error(`Declration ${component.name} is not found in registry`);
      }

      const metadata = getMetadata(component) as NgmsComponent;
      result[i] = {
        ...state,
        component: metadata.name
      };
    }

    return result;
  };

type ApplyStates = (ngModule: angular.IModule, states: StateDeclaration[]) => void;
const applyStates: ApplyStates =
  (ngModule, states) => {
    const mappedStates = mapToRouterState(states);

    ngModule.config(['$stateProvider', ($stateProvider: StateProvider) => {
      for (const state of mappedStates) {
        $stateProvider.state(state);
      }
    }]);
  };

export {ApplyStates};
export default applyStates;
