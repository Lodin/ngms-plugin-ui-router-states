import * as NgmsReflect from 'ng-metasys';
import applyStates from './apply-states';
import {StateDeclaration} from './state-declaration';

class Bootstrapper {
  public isComponent = spyOn(NgmsReflect, 'isComponent');
  public getMetadata = spyOn(NgmsReflect, 'getMetadata');

  public ngModule = {
    config: jasmine.createSpy('angular.IModule#config')
  };

  public $stateProvider = {
    state: jasmine.createSpy('$stateProvider#state')
  };
}

describe('Function `applyStates`', () => {
  let bootstrapper: Bootstrapper;

  beforeEach(() => {
    bootstrapper = new Bootstrapper();
  });

  it('should initialize states', () => {
    bootstrapper.getMetadata.and.returnValue({name: 'state'});

    class StateComponent {}

    const state: StateDeclaration = {
      name: 'app.state',
      url: '/state',
      component: StateComponent
    };

    applyStates(bootstrapper.ngModule as any, [state]);

    expect(bootstrapper.ngModule.config).toHaveBeenCalledWith([
      '$stateProvider',
      jasmine.any(Function)
    ]);

    const callback = bootstrapper.ngModule.config.calls.argsFor(0)[0][1];
    callback(bootstrapper.$stateProvider);

    expect(bootstrapper.getMetadata).toHaveBeenCalledWith(StateComponent);

    expect(bootstrapper.$stateProvider.state).toHaveBeenCalledWith({
      name: 'app.state',
      url: '/state',
      component: 'state'
    });
  });

  it('should put state as is if no component is defined', () => {
    const state: StateDeclaration = {
      name: 'app.state',
      url: '/state'
    };

    applyStates(bootstrapper.ngModule as any, [state]);

    expect(bootstrapper.ngModule.config).toHaveBeenCalledWith([
      '$stateProvider',
      jasmine.any(Function)
    ]);

    const callback = bootstrapper.ngModule.config.calls.argsFor(0)[0][1];
    callback(bootstrapper.$stateProvider);

    expect(bootstrapper.$stateProvider.state).toHaveBeenCalledWith({
      name: 'app.state',
      url: '/state'
    });
  });

  it('should add hooks to the state if any exists', () => {
    bootstrapper.getMetadata.and.returnValue({name: 'state'});

    class StateComponent {}

    const state: StateDeclaration = {
      name: 'app.state',
      url: '/state',
      component: StateComponent
    };

    const onEnter = () => {};
    const onExit = () => {};

    const hooks = new Map([[StateComponent, {onEnter, onExit}]]);

    applyStates(bootstrapper.ngModule as any, [state], hooks);

    expect(bootstrapper.ngModule.config).toHaveBeenCalledWith([
      '$stateProvider',
      jasmine.any(Function)
    ]);

    const callback = bootstrapper.ngModule.config.calls.argsFor(0)[0][1];
    callback(bootstrapper.$stateProvider);

    expect(bootstrapper.$stateProvider.state).toHaveBeenCalledWith({
      name: 'app.state',
      url: '/state',
      component: 'state',
      onEnter,
      onExit
    });
  });
});
