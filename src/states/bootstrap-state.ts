import {ModuleMetadata, tokens as ngmsTokens, isComponent} from 'ng-metasys';
import * as tokens from '../core/tokens';
import {Hooks} from '../hooks/hooks';
import {StateDeclaration} from './state-declaration';
import applyStates from './apply-states';
import checkComponent from './check-component';
import bootstrapComponentHooks from '../hooks/bootstrap-component-hooks';

type BootstrapState = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapState: BootstrapState =
  (ngModule, declaration) => {
    const moduleMetadata: ModuleMetadata =
      Reflect.getMetadata(ngmsTokens.module.self, declaration.prototype);

    if (!moduleMetadata.declarations) {
      return;
    }

    const states: StateDeclaration[] = [];
    const hooks = new Map<any, Hooks>();

    for (const possibleStateOwner of moduleMetadata.declarations) {
      if (!Reflect.hasMetadata(tokens.state, possibleStateOwner.prototype)) {
        continue;
      }

      const state: StateDeclaration =
        Reflect.getMetadata(tokens.state, possibleStateOwner.prototype);

      if (!state.name) {
        throw new Error(`State name for ${possibleStateOwner.name} is not set`);
      }

      states.push(state);

      if (state.component) {
        checkComponent(state.component);
        const componentHooks = bootstrapComponentHooks(state.component);

        if (componentHooks) {
          hooks.set(state.component, componentHooks);
        }
      }
    }

    applyStates(ngModule, states, hooks);
  };

export {BootstrapState};
export default bootstrapState;
