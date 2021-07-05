import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {TodoBL} from "../../businessLogic/todo";
import {getUserId} from "../utils";

const todoBL = new TodoBL()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // DONE: Remove a TODO item by id
  const userId = getUserId(event);
  const deletedTodo = await todoBL.delete(todoId, userId);

  if (!deletedTodo) {
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
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({})
  };
}
