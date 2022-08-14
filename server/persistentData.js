import fs from "fs";
import JSON5 from "json5";
import prettier from "prettier";
// eslint-disable-next-line
import mapUtils from '../shared/mapUtils.mjs';

const writeObject = (path, objectLiteral) =>
  new Promise((resolve, reject) => {
    const formatted = prettier.format(JSON.stringify(objectLiteral), {
      parser: "json5",
      singleQuote: true,
      trailingComma: "es5",
      printWidth: 80,
    });
    fs.writeFile(path, formatted, (err, fsData) => {
      if (err) {
        reject(err);
      } else {
        resolve(fsData);
      }
    });
  });

const readObject = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(`Error reading ${path} file. Starting from scratch.`);
        // Return an empty object if the file doesn't exist.
        resolve({});
      } else {
        try {
          const parsed = JSON5.parse(data);
          resolve(parsed);
        } catch (e) {
          console.error(
            `File ${path} exists, but is not valid JSON5. This is a fatal error. Please fix the file and try again.`
          );
          console.error("Filename:", path);
          console.error(e);
          reject(e);
        }
      }
    });
  });

const writeMap = (path, map) =>
  new Promise((resolve, reject) => {
    const formatted = prettier.format(
      mapUtils.stringify(map),
      {
        parser: "json5",
        singleQuote: true,
        trailingComma: "es5",
        printWidth: 80,
      }
    );
    fs.writeFile(path, formatted, (err, fsData) => {
      if (err) {
        reject(err);
      } else {
        resolve(fsData);
      }
    });
  });

const readMap = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading map file. Starting from scratch.");
        // Return an map object if the file doesn't exist.
        resolve(new Map());
      } else {
        try {
          const parsed = JSON5.parse(data, mapUtils.reviver);
          resolve(parsed);
        } catch (e) {
          console.error(
            `File ${path} exists, but is not valid JSON5. This is a fatal error. Please fix the file and try again.`
          );
          console.error("Filename:", path);
          console.error(e);
          reject(e);
        }
      }
    });
  });

export default { writeObject, readObject, writeMap, readMap };
