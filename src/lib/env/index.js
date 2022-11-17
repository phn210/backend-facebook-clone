const dotenv = require('dotenv');
const path = require('path');
const pkg  = require('../../../package.json');

const {
    getOsEnv, getOsEnvOptional, getOsPath, getOsPaths, normalizePort, toBool, toNumber
} = require('./utils');

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

/**
 * Environment variables
 */
const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: pkg.version || '1.0.0',
        description: pkg.description || 'Backend services',
        host: getOsEnv('APP_HOST'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
    },
    db: {
        host: getOsEnvOptional('MONGODB_HOST') ?? 'localhost',
        port: toNumber(getOsEnvOptional('MONGODB_PORT') ?? '27017'),
        database: getOsEnvOptional('MONGODB_DATABASE') ?? `facebook-clone-${process.env.NODE_ENV || 'test'}`,
        username: getOsEnvOptional('MONGODB_USERNAME'),
        password: getOsEnvOptional('MONGODB_PASSWORD'),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE')
    }
};

module.exports = env;
