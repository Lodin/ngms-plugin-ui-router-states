import * as tokens from '../core/tokens';
import applyStates from './apply-states';
import {StateDeclaration} from './state-declaration';

type BootstrapStates = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapStates: BootstrapStates =
  (ngModule, declaration) => {
    if (!Reflect.hasMetadata(tokens.states, declaration.prototype)) {
      return;
    }

    const states: StateDeclaration[] =
      Reflect.getMetadata(tokens.states, declaration.prototype);

    applyStates(ngModule, states);
  };

export {BootstrapStates};
export default bootstrapStates;
