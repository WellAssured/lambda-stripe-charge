'use strict';

const axios = require('axios');

exports.handler = (event, context, callback) => {
  const mailchimpKEY = process.env.api_key;
  const mailchimpURL = process.env.api_url;
  const json = JSON.parse(event.body);
  // Post new subscriber to Mailchimp. (List # and API Key are stored in Lambda Environment Variables)
  // a status of pending indicates that we expect Mailchimp to send a verification email to the user.
  axios.post(mailchimpURL, {
    email_address: json.email,
    status: "subscribed",
    merge_fields: {
      FNAME: json.firstName,
      LNAME: json.lastName,
    }
  },{
    auth: {
      username: 'username',
      password: mailchimpKEY,
    }
  }).then(response =>
    callback(null, {
      "isBase64Encoded": false,
      "statusCode": response.status,
      "headers": { "Access-Control-Allow-Origin": '*'},
      "body": JSON.stringify({'response': response.status, 'responseText': response.statusText})
    })
  ).catch(error => {
    if (error.response) {
      callback(null, {
        "isBase64Encoded": false,
        "statusCode": error.response.status,
        "headers": { "Access-Control-Allow-Origin": '*'},
        "body": JSON.stringify({
          'errorResponseStatus': error.response.status,
          'errorResponseData': error.response.data
        })
      });
    } else {
      callback({
        "isBase64Encoded": false,
        "statusCode": 500,
        "headers": { "Access-Control-Allow-Origin": '*'},
        "body": JSON.stringify({'response': error})
      })
    }
  });
};
