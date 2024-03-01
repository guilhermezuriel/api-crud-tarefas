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
      if (!Object.keys(req.body).length) {
        return res.writeHead(204).end('Missing content');
      }
      const { title, description } = req.body;
      if (!title || !description)
        return res.writeHead(204).end('Missing title or description');
      const creationDate = new Date().toLocaleString('en-GB');
      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        created_at: creationDate,
        updated_at: creationDate,
        completed_at: null,
      };
      database.insert('tasks', task);
      return res.writeHead(201).end();
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
    path: '/tasks/:id/complete',
  },
];
