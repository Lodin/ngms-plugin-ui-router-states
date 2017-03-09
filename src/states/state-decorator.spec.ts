import * as tokens from '../core/tokens';
import {StateDeclaration} from './state-declaration';
import State from './state-decorator';

describe('Decorator "State"', () => {
  it('should define ui-router state for single component', () => {
    const state: StateDeclaration = {
      name: 'component',
      url: '/',
      abstract: true
    };

    @State(state)
    class Component {}

    const metadata = Reflect.getMetadata(tokens.state, Component.prototype);
    expect(metadata).toEqual(state);
  });
});
