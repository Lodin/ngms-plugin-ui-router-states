import * as tokens from '../core/tokens';
import bootstrapHooks from '../hooks/bootstrap-hooks';
import {Hooks} from '../hooks/hooks';
import applyStates from './apply-states';
import checkState from './check-state';
import {StateDeclaration} from './state-declaration';
import collectHooks from '../hooks/collect-hooks';

type PrepareHooks = (states: StateDeclaration[], declaration: any) => Map<any, Hooks>;
const prepareHooks: PrepareHooks =
  (states, declaration) => {
    const moduleHooks = bootstrapHooks(declaration) as Map<any, Hooks>|null;
    const componentHooks = collectHooks(states);

    if (moduleHooks && componentHooks.size > 0) {
      for (const [mComponent, mHooks] of moduleHooks) {
        if (!componentHooks.has(mComponent)) {
          continue;
        }

        const cHooks = componentHooks.get(mComponent);
        moduleHooks.set(mComponent, {
          ...cHooks,
          ...mHooks
        });
      }

      return new Map([...componentHooks, ...moduleHooks]);
    }

    return moduleHooks ? moduleHooks : componentHooks;
  };

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
    }

    applyStates(ngModule, states, prepareHooks(states, declaration));
  };

export {BootstrapStates};
export default bootstrapStates;
