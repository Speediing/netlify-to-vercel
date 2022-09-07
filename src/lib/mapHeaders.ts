export const mapHeaders = (headers) => {
  return headers.map((header) => {
    let values = [];
    if (header?.values) {
      for (let key in header?.values) {
        values.push({
          key: key,
          value: header.values[key],
        });
      }
    }
    return {
      source: header.for.replace("*", "(.*)"),
      headers: values,
    };
  });
};
