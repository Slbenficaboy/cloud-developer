import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {TodoBL} from "../../businessLogic/todo";
import {getUserId} from "../utils";

const todoBL = new TodoBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // DONE: Return a presigned URL to upload a file for a TODO item with the provided id
  const userId = getUserId(event);

    const uploadUrl: string = await todoBL.createAttachment(todoId, userId);
    if (!uploadUrl) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: `Todo with id ${todoId} does not exit!`
            })
        }
    }

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            uploadUrl
        })
    }
}
