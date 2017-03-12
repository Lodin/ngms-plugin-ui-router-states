import * as bootstrapHooks from './bootstrap-hooks';
import collectHooks from './collect-hooks';

class Bootstrapper {
  public bootstrapHooks = spyOn(bootstrapHooks, 'default');
}

describe('Function "collectHooks"', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should collect hooks for component', () => {
    class Component {
      public static onEnter() {}
    }

    const hooks = {onEnter: Component.onEnter};

    bootstrapper.bootstrapHooks.and.returnValue(hooks);

    const states = [{name: 'component', url: '/', component: Component}];

    const collected = collectHooks(states);

    expect([...collected.entries()])
      .toEqual([[Component, {onEnter: Component.onEnter}]]);
  });

  it('should skip states without components', () => {
    const states = [{name: 'component', url: '/'}];

    const collected = collectHooks(states);

    expect([...collected.entries()])
      .toEqual([]);
  });

  it('should skip components without hooks', () => {
    class Component {}

    bootstrapper.bootstrapHooks.and.returnValue(null);

    const states = [{name: 'component', url: '/', component: Component}];

    const collected = collectHooks(states);

    expect([...collected.entries()])
      .toEqual([]);
  });
});
