import {StateDeclaration} from '../states/state-declaration';
import bootstrapHooks from './bootstrap-hooks';
import {Hooks} from './hooks';

type CollectHooks = (states: StateDeclaration[]) => Map<any, Hooks>;
const collectHooks: CollectHooks =
  states => {
    const result = new Map<any, Hooks>();

    for (const {component} of states) {
      if (!component) {
        continue;
      }

      const hooks = bootstrapHooks(component) as Hooks|null;

      if (hooks) {
        result.set(component, hooks);
      }
    }

    return result;
  };

export {CollectHooks};
export default collectHooks;
