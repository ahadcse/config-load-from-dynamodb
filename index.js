'use strict';

const aws = require('aws-sdk'),
    Promise = require('bluebird'),
    request = require('request'),
    rp = require('request-promise'),
    bunyan = require('bunyan'),
    ccoConfig = require('./configLoader');

aws.config.setPromisesDependency(Promise);

const account = process.env.account,
    LAMBDA_NAME = "config-loader",
    DEFAULT_LOG_LEVEL = "INFO",
    self = exports;

const log = bunyan.createLogger({
    name: LAMBDA_NAME,
    level: process.env.loglevel ? process.env.loglevel : DEFAULT_LOG_LEVEL,
    message: {}
});

exports.setResponse = function (b, code) {
    return {
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,Api-Key",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: code,
        body: JSON.stringify(b)
    };
}

exports.handle = (ev, ctx, cb) => {
    log.debug({event: ev}, '---- incoming event');
    return ccoConfig(ev)
        .then(d => {
            log.debug({d: d}, '---- back to main method');
            cb(null, self.setResponse(d, 200));
        })
        .catch(e => {
            log.error({error: e.stack}, '----- error');
            cb(null, self.setResponse(e, 500));
        });
}
