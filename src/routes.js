import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      return res.writeHead(200);
    },
  },
  {
    method: 'POST',
    path: '/tasks',
    handler: (req, res) => {
      const { title, description } = req.body;
      const creationDate = new Date().toLocaleString('en-GB');
      const task = {
        id: randoomUIID(),
        title: title,
        description: description,
        created_at: creationDate,
        updated_at: creationDate,
        completed_at: null,
      };
      database.insert('tasks', task);
    },
  },
  {
    method: 'PUT',
    path: '/tasks',
  },
  {
    method: 'DELETE',
    path: '/tasks',
  },
  {
    method: 'PATCH',
    path: '/tasks',
  },
];
