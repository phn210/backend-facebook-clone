const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const env = require('./lib/env');
const mongoDb = require('./database/mongo');
const routes = require('./api/routes');
const response = require('./api/controllers/responses');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));;
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use('/ping', (req, res) => {res.send({'status': 'alive'})});
app.use(env.app.routePrefix ?? '/', routes);
app.use('/public', express.static('public'));

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
    app.use(function (err, req, res, next) {
        response.sendError(res, err);
    });
}

try {
    const MONGODB_URL = `mongodb://${env.db.username}:${env.db.password}@${env.db.host}:${env.db.port}/${env.db.database}`;
    mongoDb.connect(MONGODB_URL, {}).then(() => {
        console.log('Connected to database');
    })

    app.listen(env.app.port, () => {
        console.log('Server is running on port', env.app.port);
    });
} catch (error) {
    console.error('Server crash:', error.message);
    process.exit(1);
}




