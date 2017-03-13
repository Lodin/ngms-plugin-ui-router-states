# ngms-plugin-ui-router-states

[![Latest Stable Version](https://img.shields.io/npm/v/ngms-plugin-ui-router-states.svg)](https://www.npmjs.com/package/ngms-plugin-ui-router-states)
[![License](https://img.shields.io/npm/l/ngms-plugin-ui-router-states.svg)](./LICENSE)
[![Build Status](https://img.shields.io/travis/Lodin/ngms-plugin-ui-router-states/master.svg)](https://travis-ci.org/Lodin/ngms-plugin-ui-router-states)

[![Test Coverage](https://img.shields.io/codecov/c/github/Lodin/ngms-plugin-ui-router-states/master.svg)](https://codecov.io/gh/Lodin/ngms-plugin-ui-router-states)

A plugin for [ng-metasys](https://github.com/Lodin/ng-metasys) adding support for 
[angular-ui-router](https://github.com/angular-ui/ui-router). 

## Installation
```shell
$ npm install ng-metasys ngms-plugin-ui-router-states --save
```

## Usage
### @States
`@States` is main decorator to work with this plugin. Append it to the module that will be your 
router fragment and add list of routes you want to implement.
```javascript
import {Module} from 'ng-metasys';
import {States} from 'ngms-plugin-ui-router-states';
import {AppComponent} from './app-component'; 
import {AuthComponent} from './auth-component'; 

@Module()
@States([
  {name: 'app', url: '', abstract: true, component: AppComponent},
  {name: 'app.auth', url: '/auth', component: AuthComponent}
])
export class AppModule {}
```
This code is an equivalent for:
```javascript
angular.module('AppModule', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        component: 'app'
      })
      .state('app.auth', {
        url: '/auth',
        component: 'auth'
      });
  }]);
```
### @State
If you prefer to mark single component as a state, you can use `@State` decorator. 
**Note:** components should be injected to the module directly to the `declarations` section. 
Components in dependency modules will not be counted.
```javascript
import {Component} from 'ng-metasys';
import {State} from 'ngms-plugin-ui-router-states';

@Component({
  selector: 'app',
  template: '<div></div>'
})
@State({
  name: 'app',
  url: '',
  abstract: true
})
export class AppComponent {}
```
It is an equivalent to the following code:
```javascript
angular.module('AppModule')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        component: 'app'
      })
  }])
  .component('app', {
    template: '<div></div>',
    controller: AppComponent
  });
```
### Transition state hooks
`angular-ui-router` allows to make lifecycle hooks (`onEnter`, `onExit`, etc. ) that can be used 
to implement complex router behavior. This plugin provides set of transition state hooks decorators
for static class methods for this purpose that can be applied for both module and component 
classes.

**Note:** this methods will be applied as callback to the state description object, so read the 
proper part of `ui-router` documentation.
```javascript
import {Module} from 'ng-metasys';
import {OnEnter} from 'ngms-plugin-ui-router-states';
import {AppComponent} from './app-component'; 

@Module()
@States([
  {name: 'app', url: '', abstract: true, component: AppComponent},
])
export class AppModule {
  @OnEnter(AppComponent)
  static onAppEnter($transition$, $state$) {
    // implement transition hook
  }
}
```
This is an equivalent for the following code:
```javascript
angular.module('AppModule', [])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        component: 'app',
        onEnter: function onAppEnter($transition$, $state$) {
          
        }
      });
  }]);
```
You can use it with `@State` decorator:
```javascript
import {Component} from 'ng-metasys';
import {State, OnEnter} from 'ngms-plugin-ui-router-states';

@Component({
  selector: 'app',
  template: '<div></div>'
})
@State({
  name: 'app',
  url: '',
  abstract: true
})
export class AppComponent {
  @OnEnter()
  static onEnter($transition$, $state$) {
    // implement transition hook
  }
}
```
It is an equivalent for:
```javascript
angular.module('AppModule')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        component: 'app',
        onEnter: function onEnter($transition$, $state$) {
          // implement transition hook
        }
      })
  }])
  .component('app', {
    template: '<div></div>',
    controller: AppComponent
  });
```
Or you can even use `@States` on module and transition hooks decorators in component.

**Note:** hooks defined in module is more preferable than hooks defined in component. So if you
have defined `onEnter` hook in component and in module for this component, hook in component will
be overloaded by hook in module. 

## License
Information about license can be found [here](./LICENSE).