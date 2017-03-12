import {tokens as ngmsTokens} from 'ng-metasys';
import * as tokens from '../core/tokens';
import * as collectHooks from '../hooks/collect-hooks';
import {Hooks} from '../hooks/hooks';
import * as applyStates from './apply-states';
import * as checkState from './check-state';
import bootstrapState from './bootstrap-state';

class Bootstrapper {
  public applyStates = spyOn(applyStates, 'default');
  public checkState = spyOn(checkState, 'default');
  public collectHooks = spyOn(collectHooks, 'default');

  public ngModule = {};
}

describe('Function "bootstrapState"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should create states', () => {
    bootstrapper.collectHooks.and.returnValue(new Map<any, Hooks>());

    class Component {}

    class Module {}

    Reflect.defineMetadata(
      ngmsTokens.module.self,
      {declarations: [Component]},
      Module.prototype
    );

    Reflect.defineMetadata(tokens.state, {name: 'component', url: '/'}, Component.prototype);

    bootstrapState(bootstrapper.ngModule as any, Module);

    const stateDeclaration = {name: 'component', url: '/', component: Component};

    expect(bootstrapper.checkState).toHaveBeenCalledWith(stateDeclaration);
    expect(bootstrapper.collectHooks).toHaveBeenCalledWith([stateDeclaration]);
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

    expect(bootstrapper.checkState).not.toHaveBeenCalled();
    expect(bootstrapper.collectHooks).not.toHaveBeenCalled();
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

    expect(bootstrapper.checkState).not.toHaveBeenCalled();
    expect(bootstrapper.collectHooks).not.toHaveBeenCalled();
    expect(bootstrapper.applyStates).not.toHaveBeenCalled();
  });

  it('should add hooks if any is set', () => {
    class Component {
      public static onEnter() {}
    }

    bootstrapper.collectHooks.and.returnValue(new Map([[Component, {onEnter: Component.onEnter}]]));

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
