import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { PropertyApi } from "./app/property-service";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let url = "";
  if (event)
    if (event.queryStringParameters) {
      url = event.queryStringParameters.url;
    }
  let res = await new PropertyApi().getSuumoProperty(url);
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*"
    },
    statusCode: 200,
    body: JSON.stringify({ res: res })
  };
};
