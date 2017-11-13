const tableName = 'ConfigurationDynamoDBTable',
    configName = 'configurationName',
    region = 'eu-west-1',
    cf = require('aws-cfg'),
    Promise = require('bluebird'),
    bunyan = require('bunyan'),
    log = bunyan.createLogger({name: 'configLoader'});

module.exports = (event) => {
    return new Promise((resolve, reject) => {
        log.info(`Querying for configurations for service, ${configName}`);

        cf.config({
            configName,
            tableName,
            region,
            debug: false
        })
            .then(d => {
                log.info(`config received. ${JSON.stringify(d)}`);
                event.config = d.config;
                resolve(event);
            });
    });
};
