import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        console.log("[EVENT]", JSON.stringify(event));
        const movieId = event.pathParameters?.movieId;
        if (!movieId) {
            return {
                statusCode: 500,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ message: "No movieId provided" }),
            };
        }
        const body = event.body ? JSON.parse(event.body) : undefined;
        if (!body) {
            return {
                statusCode: 500,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ message: "No body provided" }),
            };
        }

        const commandOutput = await ddbDocClient.send(
            new UpdateCommand({
                TableName: process.env.TABLE_NAME,
                Key: { id: Number(movieId) },
                UpdateExpression:
                    "set original_title = :original_title, release_date = :release_date, vote_average = :vote_average, overview = :overview",
                ExpressionAttributeValues: {
                    ":original_title": body.original_title,
                    ":release_date": body.release_date,
                    ":vote_average": body.vote_average,
                    ":overview": body.overview,
                },
                ReturnValues: "UPDATED_NEW",
            })
        );
        return {
            statusCode: 200,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ message: "Movie updated", commandOutput }),
        };
    } catch (error: any) {
        console.log(JSON.stringify(error));
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