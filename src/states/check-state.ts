import {isComponent} from 'ng-metasys';
import {StateDeclaration} from './state-declaration';

type CheckState = (state: StateDeclaration) => void;
const checkState: CheckState =
  state => {
    const name = state.name;
    const component = state.component;

    if (!name) {
      throw new Error('State name should be set');
    }

    if (component) {
      if (typeof component !== 'function') {
        throw new Error('State component should be a class declaration');
      }

      if (!isComponent(component)) {
        throw new Error(`Declaration ${component.name} should be marked as a ng-metasys `
          + '@Component');
      }
    }
  };

export {CheckState};
export default checkState;
