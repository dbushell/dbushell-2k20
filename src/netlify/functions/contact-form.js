exports.handler = async (event) => {
  const AWS = require('aws-sdk');

  const {SES_ACCESS_KEY_ID, SES_ACCESS_KEY_SECRET, SES_REGION, SES_EMAIL} =
    process.env;

  AWS.config.update({
    accessKeyId: SES_ACCESS_KEY_ID,
    secretAccessKey: SES_ACCESS_KEY_SECRET,
    region: SES_REGION
  });

  const SES = new AWS.SES();

  const data = JSON.parse(event.body);

  const params = {
    Source: SES_EMAIL,
    ReplyToAddresses: [data.replyTo],
    Destination: {
      ToAddresses: [SES_EMAIL]
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Name: ${String(data.name).substr(0, 100)}\nEmail: ${String(
            data.replyTo
          ).substr(0, 100)}\n\nEnquiry:\n${String(data.enquiry).substr(
            0,
            10000
          )}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Enquiry: ${data.name}`
      }
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://dbushell.com'
  };

  return SES.sendEmail(params)
    .promise()
    .then((data) => {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Success'
        })
      };
    })
    .catch((error) => {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: error ? error.message : 'Error'
        })
      };
    });
};
