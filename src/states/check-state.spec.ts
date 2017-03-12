import * as ngms from 'ng-metasys';
import checkState from './check-state';

class Bootstrapper {
  public isComponent = spyOn(ngms, 'isComponent');
}

describe('Function "checkState"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should throw error if the state name is not set', () => {
    expect(() => checkState({url: '/'})).toThrowError('State name should be set');
  });

  it('should do nothing if component is not set and everything is correct', () => {
    expect(() => checkState({name: 'path', url: '/'})).not.toThrow();
  });

  it('should throw error if the component is not a function', () => {
    class Component {}

    const state = {name: 'component', url: '/', component: Component.prototype};

    expect(() => checkState(state)).toThrowError('State component should be a class declaration');
  });

  it('should throw error if the declaration is not ng-metasys component', () => {
    bootstrapper.isComponent.and.returnValue(false);

    class Component {}

    const state = {name: 'component', url: '/', component: Component};

    expect(() => checkState(state))
      .toThrowError('Declaration Component should be marked as a ng-metasys @Component');
  });

  it('should do nothing if component exist and everything is correct', () => {
    bootstrapper.isComponent.and.returnValue(true);

    class Component {}

    const state = {name: 'component', url: '/', component: Component};

    expect(() => checkState(state)).not.toThrow();
  });
});
