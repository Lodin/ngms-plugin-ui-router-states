import * as tokens from '../core/tokens';
import {Hooks} from './hooks';

type HookNames = 'onEnter'|'onExit'|'onRetain';

type SetModuleHook = (hook: HookNames, component: any, property: string, target: any) => void;
const setModuleHook: SetModuleHook =
  (hook, component, property, target) => {
    if (!Reflect.hasMetadata(tokens.hooks, target)) {
      Reflect.defineMetadata(
        tokens.hooks,
        new Map<any, Hooks>([[target, {[hook]: target[property]}]]),
        target
      );
      return;
    }

    const metadata = Reflect.getMetadata(tokens.hooks, target) as Map<any, Hooks>;

    if (!metadata.has(component)) {
      metadata.set(component, {[hook]: target[property]});
    } else {
      (metadata.get(component) as Hooks)[hook] = target[property];
    }
  };

type SetComponentHook = (hook: HookNames, property: string, target: any) => void;
const setComponentHook: SetComponentHook =
  (hook, property, target) => {
    if (!Reflect.hasMetadata(tokens.hooks, target)) {
      Reflect.defineMetadata(tokens.hooks, {[hook]: target[property]}, target);
      return;
    }

    Reflect.getMetadata(tokens.hooks, target)[hook] = target[property];
  };

type HookFactory =
  (hook: HookNames) =>
    (component?: any) =>
      (target: any, property: string, descriptor?: PropertyDescriptor) => void;

const hookFactory: HookFactory =
  hook =>
    component =>
      (target, property, descriptor) => {
        if (!descriptor || (descriptor as any).initializer) {
          throw new Error(`Hook "${hook}" have to be applied to the static method`);
        }

        return component
          ? setModuleHook(hook, component, property, target)
          : setComponentHook(hook, property, target);
      };

const OnEnter = hookFactory('onEnter');
const OnExit = hookFactory('onExit');
const OnRetain = hookFactory('onRetain');

export {
  OnEnter,
  OnExit,
  OnRetain
};
