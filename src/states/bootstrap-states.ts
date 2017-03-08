import * as tokens from '../core/tokens';
import bootstrapHooks from '../hooks/bootstrap-module-hooks';
import applyStates from './apply-states';
import checkComponent from './check-component';
import {StateDeclaration} from './state-declaration';

type BootstrapStates = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapStates: BootstrapStates =
  (ngModule, declaration) => {
    if (!Reflect.hasMetadata(tokens.states, declaration.prototype)) {
      return;
    }

    const states: StateDeclaration[] =
      Reflect.getMetadata(tokens.states, declaration.prototype);

    for (const state of states) {
      checkComponent(state.component);
    }

    const hooks = bootstrapHooks(declaration) || undefined;

    applyStates(ngModule, states, hooks);
  };

export {BootstrapStates};
export default bootstrapStates;
