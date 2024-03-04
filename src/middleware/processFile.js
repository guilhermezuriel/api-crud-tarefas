import { parse } from 'csv-parse';
import fs from 'node:fs';

const __dirname = new URL('../../', import.meta.url).pathname; //dirm raiz

export const processFile = async (__filename) => {
  const records = [];
  console.log(`${__dirname}${__filename}`);
  const parser = fs
    .createReadStream(`${__dirname}/${__filename}`)
    .pipe(parse({ columns: true }));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
};
