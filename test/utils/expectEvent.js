const { assert } = require('chai');

const inLogs = async (logs, eventName) => {
  const event = logs.find(e => e.event === eventName);
  assert.exists(event);
};

const notInLogs = async (logs, eventName) => {
  const event = logs.find(e => e.event === eventName);
  assert.notExists(event);
};

const inTransaction = async (tx, eventName) => {
  const { logs } = await tx;
  return inLogs(logs, eventName);
};

const notInTransaction = async (tx, eventName) => {
  const { logs } = await tx;
  return notInLogs(logs, eventName);
};

module.exports = {
  inTransaction,
  notInTransaction,
};
