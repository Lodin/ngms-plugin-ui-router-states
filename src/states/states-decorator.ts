import * as tokens from '../core/tokens';
import {StateDeclaration} from './state-declaration';

type StatesDecorator = (states: StateDeclaration[]) => (target: any) => void;
const States: StatesDecorator =
  states =>
    target =>
      Reflect.defineMetadata(tokens.states, states, target.prototype);

export {StatesDecorator};
export default States;
