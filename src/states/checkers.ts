import {isComponent} from 'ng-metasys';
import {StateDeclaration} from './state-declaration';

type CheckComponent = (declaration: any) => void;
const checkComponent: CheckComponent =
  declaration => {
    if (typeof declaration !== 'function') {
      throw new Error('State component should be a class declaration');
    }

    if (!isComponent(declaration)) {
      throw new Error(`Declaration ${declaration.name} should be marked as a ng-metasys`
        + '@Component');
    }
  };

type CheckState = (state: StateDeclaration) => void;
const checkState: CheckState =
  state => {
    if (!state.name) {
      throw new Error('State name should be set');
    }
  };

export {
  CheckComponent,
  checkComponent,
  CheckState,
  checkState
};
