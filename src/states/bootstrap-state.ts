import {ModuleMetadata, tokens as ngmsTokens} from 'ng-metasys';
import * as tokens from '../core/tokens';
import bootstrapHooks from '../hooks/bootstrap-hooks';
import {Hooks} from '../hooks/hooks';
import {StateDeclaration} from './state-declaration';
import applyStates from './apply-states';
import checkComponent from './check-component';

type InitComponent = (declaration: any) => [StateDeclaration, Hooks|null];
const initComponent: InitComponent =
  declaration => {
    checkComponent(declaration);

    const state: StateDeclaration = Reflect.getMetadata(tokens.state, declaration.prototype);

    if (!state.name) {
      throw new Error(`State name for ${declaration.name} is not set`);
    }

    state.component = declaration;

    const hooks = bootstrapHooks(state.component) as Hooks|null;

    return [state, hooks];
  };

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

    for (const component of moduleMetadata.declarations) {
      if (!Reflect.hasMetadata(tokens.state, component.prototype)) {
        continue;
      }

      const [state, componentHooks] = initComponent(component);

      states.push(state);

      if (componentHooks) {
        hooks.set(state.component, componentHooks);
      }
    }

    if (states.length === 0) {
      return;
    }

    applyStates(ngModule, states, hooks);
  };

export {BootstrapState};
export default bootstrapState;
