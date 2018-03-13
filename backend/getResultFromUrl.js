const axios = require('axios');
const _ = require('lodash');


const getResultFromUrl = async (url, key) => {
  const response = await axios.get(url);

  return _.get(response.data, key).toString();
};

module.exports = getResultFromUrl;
