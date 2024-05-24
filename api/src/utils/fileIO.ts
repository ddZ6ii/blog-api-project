import fs, { FileHandle } from 'node:fs/promises';
import { PathLike } from 'node:fs';
import { join } from 'node:path';
import { Post } from '@/ts/posts.interface.ts';

const __dirname = import.meta.dirname;
const FILE_NAME = 'posts.json';
const FILE_PATH = join(
  __dirname,
  import.meta.env.DEV ? join('..', 'data') : 'data',
  FILE_NAME,
);

/**
 * Read file asynchronously using a promise and parse the data.
 * @param {PathLike | FileHandle =} filePath
 * @returns {Promise<Post[]>}
 */
export async function readFromJSON(
  filePath: PathLike | FileHandle = FILE_PATH,
): Promise<Post[]> {
  const jsonString = await fs.readFile(filePath, {
    encoding: 'utf8',
  });
  return JSON.parse(jsonString) as Promise<Post[]>;
}

/**
 * Serialize the data and write file asynchronously using a promise.
 * @param {Post[]} data
 * @param {PathLike | FileHandle =} filePath
 * @returns {Promise<void>}
 */
export async function writeToJSON(
  data: Post[],
  filePath: PathLike | FileHandle = FILE_PATH,
): Promise<void> {
  // Pass the number of spaces to indent by to JSON.stringify to make the output file human-readable.
  const jsonString = JSON.stringify(data, null, 2);
  return fs.writeFile(filePath, jsonString, {
    encoding: 'utf8',
  });
}
