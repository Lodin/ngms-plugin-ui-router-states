import * as tokens from '../core/tokens';
import {Hooks} from './hooks';

type BootstrapModuleHooks = (declaration: any) => Map<any, Hooks>|null;
const bootstrapModuleHooks: BootstrapModuleHooks =
  declaration =>
    Reflect.getMetadata(tokens.hooks, declaration.prototype);

export {BootstrapModuleHooks};
export default bootstrapModuleHooks;
