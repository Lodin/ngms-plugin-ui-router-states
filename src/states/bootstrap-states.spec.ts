import * as tokens from '../core/tokens';
import * as bootstrapHooks from '../hooks/bootstrap-hooks';
import {Hooks} from '../hooks/hooks';
import * as collectHooks from '../hooks/collect-hooks';
import * as applyStates from './apply-states';
import * as checkState from './check-state';
import bootstrapStates from './bootstrap-states';

class Bootstrapper {
  public applyStates = spyOn(applyStates, 'default');
  public bootstrapHooks = spyOn(bootstrapHooks, 'default');
  public checkState = spyOn(checkState, 'default');
  public collectHooks = spyOn(collectHooks, 'default');

  public ngModule = {};
}

describe('Function "bootstrapStates"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should create states', () => {
    bootstrapper.bootstrapHooks.and.returnValue(null);
    bootstrapper.collectHooks.and.returnValue(new Map<any, Hooks>());

    const componentMetadata = {name: 'component', url: '/', component: Component};

    class Component {}
    class Module {}

    Reflect.defineMetadata(tokens.states, [
      componentMetadata
    ], Module.prototype);

    bootstrapStates(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.checkState).toHaveBeenCalledWith(componentMetadata);
    expect(bootstrapper.bootstrapHooks).toHaveBeenCalledWith(Module);
    expect(bootstrapper.collectHooks).toHaveBeenCalledWith([componentMetadata]);
    expect(bootstrapper.applyStates)
      .toHaveBeenCalledWith(bootstrapper.ngModule, [componentMetadata], jasmine.any(Map));
  });

  it('should do nothing if no states is defined for this module', () => {
    bootstrapper.bootstrapHooks.and.returnValue(null);
    bootstrapper.collectHooks.and.returnValue(new Map<any, Hooks>());

    class Component {}
    class Module {}

    bootstrapStates(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.checkState).not.toHaveBeenCalled();
    expect(bootstrapper.bootstrapHooks).not.toHaveBeenCalled();
    expect(bootstrapper.collectHooks).not.toHaveBeenCalled();
    expect(bootstrapper.applyStates).not.toHaveBeenCalled();
  });

  it('should apply component hooks if any', () => {
    class Component {
      public static onExit() {}
    }

    class Module {}

    bootstrapper.bootstrapHooks.and.returnValue(null);
    bootstrapper.collectHooks.and.returnValue(new Map<any, Hooks>([
      [Component, {onExit: Component.onExit}]
    ]));

    const componentMetadata = {name: 'component', url: '/', component: Component};

    Reflect.defineMetadata(tokens.states, [
      componentMetadata
    ], Module.prototype);

    bootstrapStates(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.applyStates)
      .toHaveBeenCalledWith(bootstrapper.ngModule, [componentMetadata], jasmine.any(Map));

    const hooks = bootstrapper.applyStates.calls.argsFor(0)[2];

    expect([...hooks.entries()]).toEqual([
      [Component, {onExit: Component.onExit}]
    ]);
  });

  it('should apply module hooks if any', () => {
    class Component {}

    class Module {
      public static onComponentEnter() {}
    }

    bootstrapper.bootstrapHooks.and.returnValue(new Map<any, Hooks>([
      [Component, {onEnter: Module.onComponentEnter}]
    ]));
    bootstrapper.collectHooks.and.returnValue(new Map<any, Hooks>());

    const componentMetadata = {name: 'component', url: '/', component: Component};

    Reflect.defineMetadata(tokens.states, [
      componentMetadata
    ], Module.prototype);

    bootstrapStates(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.applyStates)
      .toHaveBeenCalledWith(bootstrapper.ngModule, [componentMetadata], jasmine.any(Map));

    const hooks = bootstrapper.applyStates.calls.argsFor(0)[2];

    expect([...hooks.entries()]).toEqual([
      [Component, {onEnter: Module.onComponentEnter}]
    ]);
  });

  it('should mix hooks defined in component and hooks defined in module', () => {
    class Component1 {
      public static onExit() {}
    }

    class Component2 {
    }

    class Component3 {
      public static onEnter() {}
    }

    class Module {
      public static onComponent1Enter() {}
      public static onComponent2Retain() {}
    }

    bootstrapper.bootstrapHooks.and.returnValue(new Map<any, Hooks>([
      [Component1, {onEnter: Module.onComponent1Enter}],
      [Component2, {onRetain: Module.onComponent2Retain}]
    ]));
    bootstrapper.collectHooks.and.returnValue(new Map<any, Hooks>([
      [Component1, {onExit: Component1.onExit}],
      [Component3, {onEnter: Component3.onEnter}]
    ]));

    const component1Metadata = {name: 'component1', url: '/', component: Component1};
    const component2Metadata = {name: 'component2', url: '/cmp', component: Component2};
    const component3Metadata = {name: 'component3', url: '/cmp2', component: Component3};

    Reflect.defineMetadata(tokens.states, [
      component1Metadata,
      component2Metadata,
      component3Metadata
    ], Module.prototype);

    bootstrapStates(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.applyStates)
      .toHaveBeenCalledWith(bootstrapper.ngModule, [
        component1Metadata,
        component2Metadata,
        component3Metadata
      ], jasmine.any(Map));

    const hooks = bootstrapper.applyStates.calls.argsFor(0)[2];

    expect([...hooks.entries()]).toEqual([
      [Component1, {
        onEnter: Module.onComponent1Enter,
        onExit: Component1.onExit
      }],
      [Component3, {
        onEnter: Component3.onEnter
      }],
      [Component2, {
        onRetain: Module.onComponent2Retain
      }]
    ]);
  });
});
