import * as tokens from '../core/tokens';
import {Hooks} from './hooks';

type BootstrapComponentHooks = (declaration: any) => Hooks|null;
const bootstrapComponentHooks: BootstrapComponentHooks =
  declaration =>
    Reflect.getMetadata(tokens.hooks, declaration.prototype);

export {BootstrapComponentHooks};
export default bootstrapComponentHooks;
