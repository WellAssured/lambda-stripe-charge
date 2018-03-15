'use strict';

const axios = require('axios');

exports.handler = (event, context, callback) => {

  const mailchimpKEY = process.env.api_key;
  const mailchimpURL = process.env.api_url;
  // Post new subscriber to Mailchimp. (List # and API Key are stored in Lambda Environment Variables)
  // a status of pending indicates that we expect Mailchimp to send a verification email to the user.
  axios.post(mailchimpURL, {
    email_address: event.email,
    status: "subscribed",
    merge_fields: {
      FNAME: event.firstName,
      LNAME: event.lastName,
    }
  },{
    auth: {
      username: 'username',
      password: mailchimpKEY,
    }
  }).then(response =>
    callback(null, {'response': response.status, 'responseText': response.statusText})
  ).catch(error => {
    if (error.request) {
      callback(null, {'errorResponseStatus': error.response.status, 'errorResponseData': error.response.data});
    } else {
      callback({'response': error});
    }
  });
};
