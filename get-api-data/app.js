const axios = require('axios');
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        const { clusterPublicUrl, clusterApiToken, endpoint, fields } = event.data;
        if (!clusterPublicUrl || !clusterApiToken || !endpoint)
            throw new Error('Event did not contain cluster URL, API endpoint, or API token.');
        const url = `${clusterPublicUrl}${endpoint}`;
        const authHeader = { "authorization": `Bearer ${clusterApiToken}` };
        const ret = await axios(url, { headers: authHeader })
            .catch(e => { throw e });
        let body = {};
        fields.forEach(f => body[f] = ret.data[f]);
        response = {
            'statusCode': 200,
            'body': JSON.stringify(body)
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
