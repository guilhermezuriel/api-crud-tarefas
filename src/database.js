import { table } from 'node:console';
import fs from 'node:fs/promises';
import { URL } from 'node:url';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }
  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value);
        });
      });
    }
    return data;
  }
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
    return data;
  }
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    if (rowIndex > -1) {
      Object.keys(data).forEach((value) => {
        if (data[value]) {
          this.#database[table][rowIndex][value] = data[value];
        }
      });
      this.#persist();
    }
  }
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    this.#database[table].splice(rowIndex, 1);
    this.#persist();
  }
  complete(table, id) {
    const completedDate = new Date().toLocaleString('en-GB');
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    this.#database[table][rowIndex]['completed_at'] = completedDate;
    this.#persist();
  }
  validateID(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    if (rowIndex === -1) return false;
    return true;
  }
}
