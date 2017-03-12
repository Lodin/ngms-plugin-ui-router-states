import {ModuleMetadata, tokens as ngmsTokens} from 'ng-metasys';
import * as tokens from '../core/tokens';
import collectHooks from '../hooks/collect-hooks';
import checkState from './check-state';
import {StateDeclaration} from './state-declaration';
import applyStates from './apply-states';

type BootstrapState = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapState: BootstrapState =
  (ngModule, declaration) => {
    const moduleMetadata: ModuleMetadata =
      Reflect.getMetadata(ngmsTokens.module.self, declaration.prototype);

    if (!moduleMetadata.declarations) {
      return;
    }

    const states: StateDeclaration[] = [];

    for (const component of moduleMetadata.declarations) {
      if (!Reflect.hasMetadata(tokens.state, component.prototype)) {
        continue;
      }

      const state: StateDeclaration = Reflect.getMetadata(tokens.state, component.prototype);
      state.component = component;

      checkState(state);

      states.push(state);
    }

    if (states.length === 0) {
      return;
    }

    applyStates(ngModule, states, collectHooks(states));
  };

export {BootstrapState};
export default bootstrapState;
