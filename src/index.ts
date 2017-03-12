import 'reflect-metadata';
import {registerPlugin} from 'ng-metasys';
import * as tokens from './core/tokens';
import bootstrapState from './states/bootstrap-state';
import bootstrapStates from './states/bootstrap-states';

registerPlugin(bootstrapState);
registerPlugin(bootstrapStates);

export {tokens};
export {hasStates, isState} from './core/reflection';
export {default as State} from './states/state-decorator';
export {default as States} from './states/states-decorator';
