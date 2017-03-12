import {isComponent, isModule} from 'ng-metasys';
import * as tokens from './tokens';

type IsState = (component: any) => boolean;
const isState: IsState =
  component =>
    isComponent(component) && Reflect.hasMetadata(tokens.state, component.prototype);

type HasStates = (module: any) => boolean;
const hasStates: HasStates =
  module =>
    isModule(module) && Reflect.hasMetadata(tokens.states, module.prototype);

export {
  HasStates,
  hasStates,
  IsState,
  isState
}
