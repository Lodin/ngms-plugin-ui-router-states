import * as tokens from '../core/tokens';
import bootstrapHooks from '../hooks/bootstrap-hooks';
import {Hooks} from '../hooks/hooks';
import applyStates from './apply-states';
import {checkComponent, checkState} from './checkers';
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
      checkState(state);

      if (state.component) {
        checkComponent(state.component);
      }
    }

    const hooks = bootstrapHooks(declaration) as Map<any, Hooks> || undefined;

    applyStates(ngModule, states, hooks);
  };

export {BootstrapStates};
export default bootstrapStates;
