import * as fflate from "fflate";

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

function stringify(map) {
  return JSON.stringify(map, replacer);
}

function parse(map) {
  return JSON.parse(map, reviver);
}

function compress(map) {
  const outputData = stringify(map);
  const buf = fflate.strToU8(outputData);

  // The default compression method is gzip
  // Increasing mem may increase performance at the cost of memory
  // The mem ranges from 0 to 12, where 4 is the default
  return fflate.compressSync(buf, { level: 6, mem: 8 });
}

function decompress(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

export default { stringify, parse, reviver, compress, decompress };
