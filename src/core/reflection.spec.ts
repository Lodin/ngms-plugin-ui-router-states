import * as ngms from 'ng-metasys';
import * as tokens from './tokens';
import {hasStates, isState} from './reflection';

class Bootstrapper {
  public isComponent = spyOn(ngms, 'isComponent');
  public isModule = spyOn(ngms, 'isModule');
}

describe('Function "hasStates"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should check if the module has states', () => {
    bootstrapper.isModule.and.returnValue(true);

    class Module {}

    Reflect.defineMetadata(tokens.states, [{name: 'path', url: '/'}], Module.prototype);

    expect(hasStates(Module)).toBeTruthy();
  });

  it('should get false if module have no states', () => {
    bootstrapper.isModule.and.returnValue(true);

    class Module {}

    expect(hasStates(Module)).not.toBeTruthy();
  });

  it('should get false is declaration is not ng-metasys @Module', () => {
    bootstrapper.isModule.and.returnValue(false);

    class Module {}

    Reflect.defineMetadata(tokens.states, [{name: 'path', url: '/'}], Module.prototype);

    expect(hasStates(Module)).not.toBeTruthy();
  });
});

describe('Function "isState"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should check if the component is state', () => {
    bootstrapper.isComponent.and.returnValue(true);

    class Component {}

    Reflect.defineMetadata(tokens.state, {name: 'path', url: '/'}, Component.prototype);

    expect(isState(Component)).toBeTruthy();
  });

  it('should get false if module have no states', () => {
    bootstrapper.isComponent.and.returnValue(true);

    class Component {}

    expect(isState(Component)).not.toBeTruthy();
  });

  it('should get false is declaration is not ng-metasys @Module', () => {
    bootstrapper.isComponent.and.returnValue(false);

    class Component {}

    Reflect.defineMetadata(tokens.state, {name: 'path', url: '/'}, Component.prototype);

    expect(isState(Component)).not.toBeTruthy();
  });
});
