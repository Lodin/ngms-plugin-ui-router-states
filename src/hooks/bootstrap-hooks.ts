import * as tokens from '../core/tokens';
import {Hooks} from './hooks';

type BootstrapHooks = (declaration: any) => Map<any, Hooks>|Hooks|null;
const bootstrapHooks: BootstrapHooks =
  declaration =>
    Reflect.getMetadata(tokens.hooks, declaration.prototype);

export {BootstrapHooks};
export default bootstrapHooks;
