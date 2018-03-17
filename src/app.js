/*!
 * zeroapp
 * Copyright(c) 2018 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var log4js = require('log4js'),
    path = require('path'),
    cwd = process.cwd();

const zeroapp = require('zeroapp');

log4js.configure({
  appenders: {
    app: {
      type: 'dateFile',
      filename: path.join(cwd, 'logs', 'app'),
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      compress: true,
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['app', 'console'],
      level: 'debug'
    }
  }
});

var logger = log4js.getLogger('app');

var app = zeroapp;

process.on('uncaughtException', function (err){
  console.error(err.stack.red);
});

process.on('exit', function (code){
  if(0 === code) return logger.warn('process exit');
  logger.error('process exit with code: %s', code);
});

app.createApp(null, function(){
  var self = this;
});
