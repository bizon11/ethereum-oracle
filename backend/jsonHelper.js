const jsonHelper = (arg) => {
  const matched = arg.match(/json\(.*?\)/g)[0];
  const key = arg.substr(matched.length + 1);
  const url = matched.substring(5, matched.length - 1);

  return { url, key };
};

module.exports = jsonHelper;
