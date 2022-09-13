function fancyName(input) {
  const snakeToCamel = (str) =>
    str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );

  const result = snakeToCamel(input)
    .replace(/([A-Z]+)/g, ' $1')
    .replace(/([A-Z][a-z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default fancyName;
