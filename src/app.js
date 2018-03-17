/*!
 * btcmarket
 * Copyright(c) 2018 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var log4js = require('log4js'),
    path = require('path'),
    cwd = process.cwd(),
    http = require('http');

const ajax = require('speedt-utils').ajax;

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

  var conf = self.get('server');
  var conf_rpc = conf.bitcoind.rpc;

  var uri = [];

  var data = {
    'jsonrpc': '1.0',
    'id': '1',
    'method': 'getblocktemplate',
    'params': [{
      'rules': ['segwit']
    }]
  };

  ajax(http.request, {
    host: '47.104.13.9',
    port: 12134,
    path: uri.join(''),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic '+ auth(conf_rpc.user, conf_rpc.pass),
    }
  }, JSON.stringify(data), null).then(html => {
    console.log(html);
  }).catch(function(){
    console.log(arguments);
  });
});

function auth(user, pass){
  var safeStr = unescape(encodeURIComponent(user +':'+ pass));
  return Buffer.from(safeStr).toString('base64');
};
