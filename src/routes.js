import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/buildRoutePath.js';
import { processFile } from './middleware/processFile.js';

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
    handler: async (req, res) => {
      const creationDate = new Date().toLocaleString('en-GB');
      // Query params -- File import
      const { filename } = req.query;
      console.log(filename);
      if (filename) {
        const records = await processFile(filename);
        console.log(records);
        if (!records)
          return res.writeHead(404).end('Arquivo csv não encontrado');
        const tasks = await records.map((record) => {
          return {
            ...record,
            id: randomUUID(),
            created_at: creationDate,
            updated_at: creationDate,
            completed_at: null,
          };
        });
        console.log(tasks);
        for await (const task of tasks) {
          database.insert('tasks', task);
        }
        return res.writeHead(200).end('As tasks foram armazenadas com sucesso');
      }
      //Request Body
      if (!Object.keys(req.body).length) {
        return res.writeHead(204).end('O conteúdo não foi preenchido');
      }
      const { title, description } = req.body;
      if (!title || !description)
        return res.writeHead(204).end('Falta título ou descrição');

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        created_at: creationDate,
        updated_at: creationDate,
        completed_at: null,
      };
      database.insert('tasks', task);
      return res.writeHead(201).end('A task foi criada com sucesso');
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      if (!database.validateID('tasks', id))
        return res.writeHead(404).end('O registro não existe');
      const { title, description } = req.body;
      const updated_at = new Date().toLocaleString('en-GB');
      database.update('tasks', id, {
        title,
        description,
        updated_at,
      });
      return res.writeHead(204).end('O conteúdo foi alterado');
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      if (!database.validateID('tasks', id))
        return res.writeHead(404).end('O registro não existe');
      database.delete('tasks', id);
      return res.writeHead(204).end('A task foi removida');
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      if (!database.validateID('tasks', id))
        return res.writeHead(404).end('O registro não existe');
      database.complete('tasks', id);
      return res.writeHead(204).end('A task foi marcada como completa');
    },
  },
];
