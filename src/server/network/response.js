// const appError = require('../components/errors/controller.js');
// const ValidationError = require('../utils/error/ValidationError');

exports.success = function(req, res, message, status) {
  res.status(status || 200).send({ error: '', body: message });
};

exports.error = async function(req, res, message, status, details) {
  console.log('[response error]', details);
  console.log('[response message]', message);
  const messageText = message;
  // if (details instanceof ValidationError) {
  //   messageText = details.message;
  // }
  try {
    // await appError.create(req, res, details);
  } catch (e) {
    console.log('appError.create error ', e);
  }
  res.status(status || 200).send({ error: messageText, body: '' });
};
