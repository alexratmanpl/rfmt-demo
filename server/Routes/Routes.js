/**
 * @author Alex Ratman
 */

import fs from 'fs';
import DbController from '../Controllers/DbController.js';
import { fillTemplate } from '../Helpers/DataHelper.js';

const dbController = new DbController();
const html = fs.readFileSync(`${process.cwd()}/build/index.html`, 'utf8');

export default [
  {
      method: 'GET',
      url: '/favicon.ico',
      handler: function(req, reply) {
          const stream = fs.createReadStream(`build/img/favicon.ico`);
          reply.type('image/x-icon').send(stream);
      }
  },
  {
      method: 'GET',
      url: '/',
      handler: async (req, reply) => {
          const { descendants, element } = await dbController.getDbElementAndDescendantsAction(req.query);
          const { largest } = await dbController.getDbElementsLargestChildrenAction(req.query);
          const data = { descendants, element, largest};
          const view = fillTemplate({ data, html });
          reply.type('text/html').send(view);
      }
  },
  {
      method: 'GET',
      url: '/api/search',
      handler: async (req, reply) => {
          const result = await dbController.searchDbAction(req.query);
          reply.type('application/json').send(result);
      }
  },
  {
      method: 'GET',
      url: '/api/species/get',
      handler: async (req, reply) => {
          const result = await dbController.getDbElementAndDescendantsAction(req.query);
          reply.type('application/json').send(result);
      }
  },
  {
      method: 'GET',
      url: '/api/species/get/largest',
      handler: async (req, reply) => {
          const result = await dbController.getDbElementsLargestChildrenAction(req.query);
          reply.type('application/json').send(result);
      }
  },
  {
      method: 'POST',
      url: '/api/species/get/wnids',
      handler: async (req, reply) => {
          const result = await dbController.getDbElementsChildrenAction(req.body);
          reply.type('application/json').send(result);
      }
  }
];