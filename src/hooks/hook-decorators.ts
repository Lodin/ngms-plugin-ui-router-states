import * as tokens from '../core/tokens';

type HookFactory = (hook: string) => (name?: string) => (target: any, property: string) => void;
const hookFactory: HookFactory =
  hook =>
    name =>
      (target, property) =>
        Reflect.defineMetadata(tokens.hooks,
          name
            ? {hook, property, name}
            : {hook, property},
          target);

const OnEnter = hookFactory('onEnter');
const OnExit = hookFactory('onExit');
const OnRetain = hookFactory('onRetain');

export {
  OnEnter,
  OnExit,
  OnRetain
};
