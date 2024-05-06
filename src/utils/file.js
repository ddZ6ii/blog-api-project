import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_NAME = 'posts.json';
const FILE_PATH = join(__dirname, `../data/${FILE_NAME}`);

// Read file asynchronously using a promise and parse the data.
export async function readFromJSON(
  filePath = FILE_PATH,
  options = {
    encoding: 'utf8',
  },
) {
  const jsonString = await fs.readFile(filePath, options);
  return JSON.parse(jsonString);
}

// Serialize the data and write file asynchronously using a promise.
export async function writeToJSON(
  data,
  options = {
    encoding: 'utf8',
  },
  filePath = FILE_PATH,
) {
  // Pass the number of spaces to indent by to JSON.stringify to make the output file human-readable.
  const jsonString = JSON.stringify(data, null, 2);
  return fs.writeFile(filePath, jsonString, options);
}
