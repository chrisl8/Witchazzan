import fs from 'fs/promises';
import JSON5 from 'json5';
import prettier from 'prettier';
// eslint-disable-next-line
import mapUtils from './utilities/mapUtils.js';

const writeObject = async (path, objectLiteral) => {
  const formatted = await prettier.format(JSON.stringify(objectLiteral), {
    parser: 'json5',
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 80,
  });
  return fs.writeFile(path, formatted);
};

const readObject = async (path) => {
  let data = {};
  try {
    data = await fs.readFile(path, 'utf8');
  } catch (e) {
    console.log(`Error reading ${path} file. Starting from scratch.`);
    // Return an empty object if the file doesn't exist.
    return {};
  }
  try {
    return JSON5.parse(data);
  } catch (e) {
    console.error(
      `File ${path} exists, but is not valid JSON5. This is a fatal error. Please fix the file and try again.`,
    );
    console.error('Filename:', path);
    throw e;
  }
};

const writeMap = async (path, map) => {
  const formatted = await prettier.format(mapUtils.stringify(map), {
    parser: 'json5',
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 80,
  });
  return fs.writeFile(path, formatted);
};

const readMap = async (path) => {
  let data = new Map();
  try {
    data = await fs.readFile(path, 'utf8');
  } catch (e) {
    console.log('Error reading map file. Starting from scratch.');
    // Return an map object if the file doesn't exist.
    return new Map();
  }
  try {
    return JSON5.parse(data, mapUtils.reviver);
  } catch (e) {
    console.error(
      `File ${path} exists, but is not valid JSON5. This is a fatal error. Please fix the file and try again.`,
    );
    console.error('Filename:', path);
    throw e;
  }
};

export default { writeObject, readObject, writeMap, readMap };
