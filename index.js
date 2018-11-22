'use strict';

const stripe = require('stripe')(process.env.stripeKey);

exports.handler = (event, context, callback) => {
  const json = JSON.parse(event.body);

  stripe.customers.create(json.customer)
    .then(customer => stripe.customers.createSource(customer.id, json.token))
    .then(source => stripe.charges.create({ customer: source.customer, ...json.charge }))
    .then(charge => {
      console.log(JSON.stringify(charge));
      callback(null, {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Access-Control-Allow-Origin": '*'},
        "body": JSON.stringify(charge)  // {'response': response.status, 'responseText': response.statusText})
      });
    }).catch(error => {
      console.log(JSON.stringify(error));
      callback(null, {
        "isBase64Encoded": false,
        "statusCode": 400,
        "headers": { "Access-Control-Allow-Origin": '*'},
        "body": JSON.stringify(error)
      });
    });
};
