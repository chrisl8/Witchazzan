import fs from "fs";
import JSON5 from "json5";
import prettier from "prettier";
import jsonMapStringify from "../shared/jsonMapStringify.mjs";

const writeObject = (path, objectLiteral) => {
  return new Promise((resolve, reject) => {
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
};

const readObject = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading config file. Starting from scratch.");
        // Return an empty object if the file doesn't exist.
        resolve({});
      } else {
        try {
          const parsed = JSON5.parse(data);
          resolve(parsed);
        } catch (e) {
          console.error(
            "Config file exists, but is not valid JSON5. This is a fatal error. Please fix the file and try again."
          );
          console.error("Filename:", path);
          console.error(e);
          reject(e);
        }
      }
    });
  });
};

const writeMap = (path, map) => {
  return new Promise((resolve, reject) => {
    const formatted = prettier.format(
      JSON.stringify(map, jsonMapStringify.replacer),
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
};

const readMap = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading map file. Starting from scratch.");
        // Return an map object if the file doesn't exist.
        resolve(new Map());
      } else {
        try {
          const parsed = JSON5.parse(data, jsonMapStringify.reviver);
          resolve(parsed);
        } catch (e) {
          console.error(
            "Config file exists, but is not valid JSON5. This is a fatal error. Please fix the file and try again."
          );
          console.error("Filename:", path);
          console.error(e);
          reject(e);
        }
      }
    });
  });
};

export default { writeObject, readObject, writeMap, readMap };
