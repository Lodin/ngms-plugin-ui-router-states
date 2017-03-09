import {tokens as ngmsTokens} from 'ng-metasys';
import * as tokens from '../core/tokens';
import * as bootstrapHooks from '../hooks/bootstrap-hooks';
import {Hooks} from '../hooks/hooks';
import * as applyStates from './apply-states';
import * as checkComponent from './check-component';
import bootstrapState from './bootstrap-state';

class Bootstrapper {
  public applyStates = spyOn(applyStates, 'default');
  public checkComponent = spyOn(checkComponent, 'default');
  public bootstrapHooks = spyOn(bootstrapHooks, 'default');

  public ngModule = {};
}

describe('Function "bootstrapState"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should create states', () => {
    bootstrapper.bootstrapHooks.and.returnValue(null);

    class Component {}

    class Module {}

    Reflect.defineMetadata(
      ngmsTokens.module.self,
      {declarations: [Component]},
      Module.prototype
    );

    Reflect.defineMetadata(tokens.state, {name: 'component', url: '/'}, Component.prototype);

    bootstrapState(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.checkComponent).toHaveBeenCalledWith(Component);
    expect(bootstrapper.bootstrapHooks).toHaveBeenCalledWith(Component);
    expect(bootstrapper.applyStates)
      .toHaveBeenCalledWith(bootstrapper.ngModule, [
        {name: 'component', url: '/', component: Component}
      ], jasmine.any(Map));
  });

  it('should do nothing if there is nothing module declarations', () => {
    class Module {}

    Reflect.defineMetadata(
      ngmsTokens.module.self,
      {declarations: null},
      Module.prototype
    );

    bootstrapState(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.checkComponent).not.toHaveBeenCalled();
    expect(bootstrapper.bootstrapHooks).not.toHaveBeenCalled();
    expect(bootstrapper.applyStates).not.toHaveBeenCalled();
  });

  it('should do nothing if there is no component declaration in module', () => {
    class Directive {}
    class Filter {}

    class Module {}

    Reflect.defineMetadata(
      ngmsTokens.module.self,
      {declarations: [Directive, Filter]},
      Module.prototype
    );

    bootstrapState(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.checkComponent).not.toHaveBeenCalled();
    expect(bootstrapper.bootstrapHooks).not.toHaveBeenCalled();
    expect(bootstrapper.applyStates).not.toHaveBeenCalled();
  });

  it('should throw an error if there is no name for state', () => {
    bootstrapper.bootstrapHooks.and.returnValue(null);

    class Component {}

    class Module {}

    Reflect.defineMetadata(
      ngmsTokens.module.self,
      {declarations: [Component]},
      Module.prototype
    );

    Reflect.defineMetadata(tokens.state, {url: '/'}, Component.prototype);

    expect(() => bootstrapState(bootstrapper.ngModule as any, Module))
      .toThrowError('State name for Component is not set');
  });

  it('should add hooks if any is set', () => {
    class Component {
      public static onEnter() {}
    }

    bootstrapper.bootstrapHooks.and.returnValue({onEnter: Component.onEnter});

    class Module {}

    Reflect.defineMetadata(
      ngmsTokens.module.self,
      {declarations: [Component]},
      Module.prototype
    );

    Reflect.defineMetadata(tokens.state, {name: 'component', url: '/'}, Component.prototype);

    bootstrapState(bootstrapper.ngModule as any, Module);

    const hooks = bootstrapper.applyStates.calls.argsFor(0)[2] as Map<any, Hooks>;

    expect([...hooks.entries()]).toEqual([[Component, {onEnter: Component.onEnter}]]);
  });
});
