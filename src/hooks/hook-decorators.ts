import * as tokens from '../core/tokens';
import {Hooks} from './hooks';

type HookNames = 'onEnter'|'onExit'|'onRetain';

type SetModuleHook = (hook: HookNames, component: any, property: string, target: any) => void;
const setModuleHook: SetModuleHook =
  (hook, component, property, target) => {
    if (!Reflect.hasMetadata(tokens.hooks, target.prototype)) {
      Reflect.defineMetadata(
        tokens.hooks,
        new Map<any, Hooks>([[component, {[hook]: target[property]}]]),
        target.prototype
      );
      return;
    }

    const metadata = Reflect.getMetadata(tokens.hooks, target.prototype) as Map<any, Hooks>;

    if (!metadata.has(component)) {
      metadata.set(component, {[hook]: target[property]});
    } else {
      (metadata.get(component) as Hooks)[hook] = target[property];
    }
  };

type SetComponentHook = (hook: HookNames, property: string, target: any) => void;
const setComponentHook: SetComponentHook =
  (hook, property, target) => {
    if (!Reflect.hasMetadata(tokens.hooks, target.prototype)) {
      Reflect.defineMetadata(tokens.hooks, {[hook]: target[property]}, target.prototype);
      return;
    }

    Reflect.getMetadata(tokens.hooks, target.prototype)[hook] = target[property];
  };

type HookFactory =
  (hook: HookNames) =>
    (component?: any) =>
      (target: any, property: string) => void;

const hookFactory: HookFactory =
  hook =>
    component =>
      (target, property) => {
        if (typeof target !== 'function') {
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
