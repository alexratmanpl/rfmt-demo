/**
 * @author Alex Ratman
 */

import path from 'path';
import fastify from 'fastify';
import cors from 'fastify-cors';
import staticDir from 'fastify-static';
import DataController from './Controllers/DataController.js';
import DbController from './Controllers/DbController.js';
import routes from './Routes/Routes.js';
import { data } from './config.js';

const server = fastify();

const dataController = new DataController();
const dbController = new DbController();

server.register(cors, {});

server.register(staticDir, {
    root: path.join(process.cwd(), 'build/css'),
    prefix: '/public/css',
    decorateReply: false
});

server.register(staticDir, {
    root: path.join(process.cwd(), 'build/js'),
    prefix: '/public/js',
    decorateReply: false
});

server.register(staticDir, {
    root: path.join(process.cwd(), 'build/web_modules'),
    prefix: '/web_modules',
    decorateReply: false
});

routes.map(route => server.route(route));

/**
 * @returns {void}
 */
const start = async () => {
    try {
        const json = await dataController.fetchDataAction(data);
        await dbController.connectDbAction();
        await dbController.updateDbAction(json);
        await server.listen(8081, '::');
        console.log(`server listening on ${server.server.address().port}`);
    } catch (e) {
        dbController.closeDbAction();
        console.log(e);
        process.exit(1);
    }
};

start();
