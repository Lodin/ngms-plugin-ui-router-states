import * as tokens from '../core/tokens';
import {StateDeclaration} from './state-declaration';

type StateDecorator = (state: StateDeclaration) => (target: any) => void;
const State: StateDecorator =
  state =>
    target =>
      Reflect.defineMetadata(tokens.state, state, target.prototype);

export {StateDecorator};
export default State;
