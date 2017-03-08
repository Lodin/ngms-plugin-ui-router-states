import {Ng1StateTransitionHook} from 'angular-ui-router';

export interface Hooks {
  onEnter?: Ng1StateTransitionHook;
  onExit?: Ng1StateTransitionHook;
  onRetain?: Ng1StateTransitionHook;
}
