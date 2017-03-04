import {ModuleMetadata, tokens as ngmsTokens} from 'ng-metasys';
import * as tokens from '../core/tokens';
import {StateDeclaration} from './state-declaration';
import applyStates from './apply-states';

type BootstrapStates = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapStates: BootstrapStates =
  (ngModule, declaration) => {
    const moduleMetadata: ModuleMetadata =
      Reflect.getMetadata(ngmsTokens.module.self, declaration.prototype);

    if (!moduleMetadata.declarations) {
      return;
    }

    const states: StateDeclaration[] = [];

    for (const possibleState of moduleMetadata.declarations) {
      if (!Reflect.hasMetadata(tokens.state, possibleState.prototype)) {
        continue;
      }

      const state: StateDeclaration = Reflect.getMetadata(tokens.state, possibleState.prototype);
      states.push(state);
    }

    applyStates(ngModule, states);
  };

export {BootstrapStates};
export default bootstrapStates;
