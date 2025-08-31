import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import 'source-map-support/register';
import AWS from 'aws-sdk';

const ddbDocClient = createDDbDocClient();
const translate = new AWS.Translate();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        console.log("[EVENT]", JSON.stringify(event));
        const movieId = event.pathParameters?.movieId;
        const language = event.queryStringParameters?.language

        if (!movieId) {
            return {
                statusCode: 500,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ message: "Invalid movieId provided" }),
            };
        }

        if (!language) {
            return {
                statusCode: 500,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ message: "Invalid language provided" }),
            };
        }
        const commandOutput = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.TABLE_NAME,
                Key: { id: Number(movieId) },
            })
        );

        if (!commandOutput.Item) {
            return {
                statusCode: 404,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ Message: "Invalid movieId provided" }),
            };
        }

        const overview = commandOutput.Item.overview;
        const params = {
            Text: overview,
            SourceLanguageCode: 'en',
            TargetLanguageCode: language
        };

        const translationResult = await translate.translateText(params).promise();

        commandOutput.Item.overview = translationResult.TranslatedText;

        return {
            statusCode: 200,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ data: commandOutput.Item }),
        };
    }
    catch (error: any) {
        console.log(JSON.stringify(error))
        return {
            statusCode: 500,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ error }),
        };
    }
}

function createDDbDocClient() {
    const ddbClient = new DynamoDBClient({ region: process.env.REGION });
    const marshallOptions = {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    };
    const unmarshallOptions = {
        wrapNumbers: false,
    };
    const translateConfig = { marshallOptions, unmarshallOptions };
    return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}