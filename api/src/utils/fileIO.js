import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_NAME = 'posts.json';
const FILE_PATH = join(
  __dirname,
  `${import.meta.env.DEV ? join('..', 'data') : 'data'}`,
  FILE_NAME,
);

/**
 * Read file asynchronously using a promise and parse the data.
 * @param {string} filePath
 * @param {{encoding?: string | null, flag?: OpenMode | undefined}} options description
 * @returns
 */
export async function readFromJSON(filePath = FILE_PATH, options = 'utf8') {
  const jsonString = await fs.readFile(filePath, options);
  return JSON.parse(jsonString);
}

/**
 * Serialize the data and write file asynchronously using a promise.
 * @param {string | Buffer | TypedArray | DataView | AsyncIterable | Iterable | String} data
 * @param {{encoding?: string | null, mode?: integer, flag?: string, flush?: boolean, signal?: AbortSignal}} options
 * @param {string | Buffer | URL | FileHandle} filePath
 * @returns {Promise<undefined>}
 */
export async function writeToJSON(
  data,
  options = 'utf8',
  filePath = FILE_PATH,
) {
  // Pass the number of spaces to indent by to JSON.stringify to make the output file human-readable.
  const jsonString = JSON.stringify(data, null, 2);
  return fs.writeFile(filePath, jsonString, options);
}
