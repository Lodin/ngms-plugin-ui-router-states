import * as tokens from '../core/tokens';
import {StateDeclaration} from './state-declaration';
import States from './states-decorator';

describe('Decorator "State"', () => {
  it('should define ui-router states list for module', () => {
    class Component1 {}
    class Component2 {}

    const states: StateDeclaration[] = [
      {name: 'component1', url: '/', abstract: true, component: Component1},
      {name: 'component2', url: '/auth', component: Component2}
    ];

    @States(states)
    class Module {
    }

    const metadata = Reflect.getMetadata(tokens.states, Module.prototype);
    expect(metadata).toEqual(states);
  });
});
