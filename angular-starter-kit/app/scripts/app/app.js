'use strict';

import appConfig from './app-config.js';
import appFactory from './app-factory.js';
import appCtrls from './app-controllers.js';

export default angular.module('app', [() => {
  console.log('run app');
}]).controller('appCtrls',appCtrls);
