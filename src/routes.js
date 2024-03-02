import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/buildRoutePath.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        'tasks',
        search ? { title: search, description: search } : null,
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (!Object.keys(req.body).length) {
        return res.writeHead(204).end();
      }
      const { title, description } = req.body;
      if (!title || !description) return res.writeHead(204).end();
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
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const updated_at = new Date().toLocaleString('en-GB');
      database.update('tasks', id, {
        title,
        description,
        updated_at,
      });
      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: '/tasks/:id',
  },
  {
    method: 'PATCH',
    path: '/tasks/:id/complete',
  },
];
