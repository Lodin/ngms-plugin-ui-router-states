import * as ngms from 'ng-metasys';
import * as reflection from '../core/reflection';
import * as tokens from '../core/tokens';
import * as bootstrapHooks from '../hooks/bootstrap-hooks';
import {Hooks} from '../hooks/hooks';
import * as collectHooks from '../hooks/collect-hooks';
import * as applyStates from './apply-states';
import * as checkState from './check-state';
import bootstrapStates from './bootstrap-states';
import States from './states-decorator';
import {OnEnter} from '../hooks/hook-decorators';

class Bootstrapper {
  public applyStates = spyOn(applyStates, 'default');
  public bootstrapHooks = spyOn(bootstrapHooks, 'default');
  public checkState = spyOn(checkState, 'default');
  public collectHooks = spyOn(collectHooks, 'default');
  public isState = spyOn(reflection, 'isState');
  public isComponent = spyOn(ngms, 'isComponent');

  public ngModule = {};

  public unarm(...toUnarm: string[]): void {
    const hasAll = toUnarm.includes('all');

    if (toUnarm.includes('bootstrapHooks') || hasAll) {
      this.bootstrapHooks.and.returnValue(null);
    }

    if (toUnarm.includes('collectHooks') || hasAll) {
      this.collectHooks.and.returnValue(new Map<any, Hooks>())
    }

    if (toUnarm.includes('isState') || hasAll) {
      this.isState.and.returnValue(false);
    }
  }
}

describe('Function "bootstrapStates"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should create states', () => {
    bootstrapper.unarm('all');

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
    bootstrapper.unarm('all');

    class Component {}
    class Module {}

    bootstrapStates(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.checkState).not.toHaveBeenCalled();
    expect(bootstrapper.bootstrapHooks).not.toHaveBeenCalled();
    expect(bootstrapper.collectHooks).not.toHaveBeenCalled();
    expect(bootstrapper.applyStates).not.toHaveBeenCalled();
  });

  it('should throw an error if the state component is already defined as state', () => {
    bootstrapper.unarm('bootstrapHooks', 'collectHooks');
    bootstrapper.isState.and.returnValue(true);

    class Component {}
    class Module {}

    const componentMetadata = {name: 'component', url: '/', component: Component};

    Reflect.defineMetadata(tokens.states, [
      componentMetadata
    ], Module.prototype);

    expect(() => bootstrapStates(bootstrapper.ngModule as any, Module))
      .toThrowError('Component Component is already state. You cannot overload it '
        + 'in module');
  });

  it('should apply component hooks if any', () => {
    bootstrapper.unarm('bootstrapHooks', 'isState');

    class Component {
      public static onExit() {}
    }

    class Module {}

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
    bootstrapper.unarm('collectHooks', 'isState');

    class Component {}

    class Module {
      public static onComponentEnter() {}
    }

    bootstrapper.bootstrapHooks.and.returnValue(new Map<any, Hooks>([
      [Component, {onEnter: Module.onComponentEnter}]
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
      [Component, {onEnter: Module.onComponentEnter}]
    ]);
  });

  it('should mix hooks defined in component and hooks defined in module', () => {
    bootstrapper.unarm('isState');

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

describe('Decorator "States" and function "bootstrapStates"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
    bootstrapper.bootstrapHooks.and.callThrough();
    bootstrapper.checkState.and.callThrough();
    bootstrapper.collectHooks.and.callThrough();
    bootstrapper.isState.and.callThrough();
  });

  it('should work together', () => {
    bootstrapper.isComponent.and.returnValue(true);

    class Component {}

    @States([
      {name: 'component', url: '/', component: Component}
    ])
    class Module {
      @OnEnter(Component)
      public static onComponentEnter() {}
    }

    bootstrapStates(bootstrapper.ngModule as any, Module);

    expect(bootstrapper.applyStates)
      .toHaveBeenCalledWith(bootstrapper.ngModule, [
        {name: 'component', url: '/', component: Component}
      ], jasmine.any(Map));

    const hooks = bootstrapper.applyStates.calls.argsFor(0)[2];

    expect([...hooks.entries()])
      .toEqual([
        [Component, {onEnter: Module.onComponentEnter}]
      ]);
  });
});
