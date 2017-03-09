import * as tokens from '../core/tokens';
import bootstrapHooks from './bootstrap-hooks';
import {OnEnter} from './hook-decorators';

describe('Function "bootstrapHooks"', () => {
  it('should get metadata for specified declaration', () => {
    class Component {
      public static onEnter() {}
    }
    const metadata = {onEnter: Component.onEnter};

    Reflect.defineMetadata(tokens.hooks, metadata, Component.prototype);

    expect(bootstrapHooks(Component)).toEqual(metadata);
  });
});

describe('Decorators "OnEnter", "OnExit", "OnRemain" and function "bootstrapHooks"', () => {
  it('should work together', () => {
    class Component {
      @OnEnter()
      public static onEnter() {}
    }

    expect(bootstrapHooks(Component)).toEqual({onEnter: Component.onEnter});
  });
});
