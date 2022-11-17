const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const env = require('./lib/env');
const mongoDb = require('./database/mongo');
const routes = require('./api/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));;
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use('/ping', (req, res) => {res.send({'status': 'alive'})})
app.use(env.app.routePrefix ?? '/api', routes);
if (env.swagger.enabled) {
    const options = {
        failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
        definition: {
            openapi: '3.0.0',
            info: {
                title: env.app.name,
                description: env.app.description,
                version: env.app.version
            },
            host: `${env.app.host}:${env.app.port}`,

        },
        apis: ['./src/api/routes/*.js'],
        basePath: env.app.routePrefix
    };
    const swaggerSpec = swaggerJsdoc(options);
    app.use(`${env.swagger.route}`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('API docs is enabled')
}

try {
    app.listen(env.app.port, () => {
        console.log('Server is running on port', env.app.port);
    });
} catch (error) {
    console.error('Server crash:', error.message);
    process.exit(1);
}




