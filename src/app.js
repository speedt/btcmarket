/*!
 * btcmarket
 * Copyright(c) 2018 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var log4js  = require('log4js'),
    path    = require('path'),
    cwd     = process.cwd(),
    request = require('request');

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

var method = {
  'jsonrpc': '1.0',
  'id': '1',
  'method': 'getblocktemplate',
  'params': [{
    'rules': ['segwit']
  }]
};

app.createApp(null, function(){
  var self = this;

  var conf = self.get('server').bitcoind.rpc;

  callRpc(method, conf, (err, data) => {
    if(err) return logger.error(err);
    logger.info(JSON.stringify(data));
  });
});

function callRpc(method, conf, cb){
  request({
    url: conf.uri,
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Basic '+ auth(conf.user, conf.pass)
    },
    body: method,
  }, function (err, resp, data){
    if(err) return cb(err);
    if(200 === resp.statusCode) return cb(null, data);
    cb(new Error(resp.statusCode));
  });
}

function auth(user, pass){
  var safe = unescape(encodeURIComponent(user +':'+ pass));
  return Buffer.from(safe).toString('base64');
}
