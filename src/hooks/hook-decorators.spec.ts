import * as tokens from '../core/tokens';
import {OnEnter, OnExit} from './hook-decorators';

describe('Decorators "OnEnter", "OnExit", "OnRemain"', () => {
  it('should throw an error if it applied to a non-static method', () => {
    expect(() => {
      class WrongComponent {
        @OnEnter()
        public onEnter() {}
      }
    }).toThrowError('Hook "onEnter" have to be applied to the static method');
  });

  describe('in module', () => {
    it('should add metadata to a first decorated method', () => {
      class Component {
      }

      class Module {
        @OnEnter(Component)
        public static onComponentEnter() {
        }
      }

      const metadata = Reflect.getMetadata(tokens.hooks, Module.prototype);

      expect([...metadata.entries()])
        .toEqual([[Component, {onEnter: Module.onComponentEnter}]]);
    });

    it('should add new hook for component if one is already set', () => {
      class Component {
      }

      class Module {
        @OnEnter(Component)
        public static onComponentEnter() {
        }

        @OnExit(Component)
        public static onComponentExit() {
        }
      }

      const metadata = Reflect.getMetadata(tokens.hooks, Module.prototype);
      expect([...metadata.entries()])
        .toEqual([[Component, {
          onEnter: Module.onComponentEnter,
          onExit: Module.onComponentExit
        }]]);
    });

    it('should add new component to a hook list', () => {
      class Component1 {
      }

      class Component2 {
      }

      class Module {
        @OnEnter(Component1)
        public static onComponent1Enter() {
        }

        @OnEnter(Component2)
        public static onComponent2Enter() {
        }
      }

      const metadata = Reflect.getMetadata(tokens.hooks, Module.prototype);
      expect([...metadata.entries()])
        .toEqual([
          [Component1, {onEnter: Module.onComponent1Enter}],
          [Component2, {onEnter: Module.onComponent2Enter}]
        ]);
    });
  });

  describe('in component', () => {
    it('should add metadata to a first decorated method', () => {
      class Component {
        @OnEnter()
        public static onEnter() {
        }
      }

      const metadata = Reflect.getMetadata(tokens.hooks, Component.prototype);
      expect(metadata).toEqual({onEnter: Component.onEnter});
    });

    it('should add new hook for component if one is already set', () => {
      class Component {
        @OnEnter()
        public static onEnter() {
        }

        @OnExit()
        public static onExit() {
        }
      }

      const metadata = Reflect.getMetadata(tokens.hooks, Component.prototype);
      expect(metadata).toEqual({onEnter: Component.onEnter, onExit: Component.onExit});
    });
  });
});
