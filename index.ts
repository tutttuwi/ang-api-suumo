import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { PropertyApi } from "./app/property-service";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let url = "";
  let response = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*"
    },
    statusCode: 200,
    body: ""
  };

  if (event)
    if (event.queryStringParameters) {
      url = event.queryStringParameters.url;
    }
  if (!url) {
    return response;
  }
  let body = await new PropertyApi().getSuumoProperty(url);
  response.body = JSON.stringify(body);
  return response;
};
