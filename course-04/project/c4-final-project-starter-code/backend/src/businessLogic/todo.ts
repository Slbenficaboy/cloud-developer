import * as uuid from "uuid";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {TodoAccess} from "../dataLayer/todoAccess";
import {TodoItem} from "../models/TodoItem";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {createLogger} from "../utils/logger";

const todoAccess = new TodoAccess()
const logger = createLogger("todos-service")

export class TodoBL {
    async createNew(newTodoData: CreateTodoRequest, userId: string) {
        const newTodo: TodoItem = {
            userId: userId,
            todoId: uuid.v4(),
            createdAt: new Date().toISOString(),
            ...newTodoData,
            done: false
        }
        await todoAccess.saveTodo(newTodo)
        logger.info(`User ${userId} created new todo with id: ${newTodo.todoId}.`)
        delete newTodo['userId']
        return newTodo
    }

    async delete(todoId: string, userId: string) {
        const todo = await todoAccess.findTodo(todoId, userId)
        if (todo) {
            await todoAccess.deleteTodo(todoId, userId);
            logger.info(`User ${userId} deleted todo with id: ${todoId}.`)
            return todo
        }
        return undefined
    }

    async createAttachment(todoId: string, userId: string) {
        const todo = await todoAccess.findTodo(todoId, userId)
        if (todo) {
            await todoAccess.addTodoAttachment(todoId, userId);
            logger.info(`User ${userId} added attachment for todo with id: ${todoId}.`)
            return todoAccess.getUploadUrlForTodo(todoId)
        }
        return undefined
    }

    async findAll(userId: string) {
        logger.info(`User ${userId} requested all todos.`)
        return await todoAccess.getTodos(userId)
    }

    async update(todoId: string, updateTodoData: UpdateTodoRequest, userId: string) {
        const oldTodo = await todoAccess.findTodo(todoId, userId)
        if (oldTodo) {
            await todoAccess.updateTodo(todoId, userId, updateTodoData)
            logger.info(`User ${userId} updated todo with id: ${todoId}`)
            return oldTodo
        }
        return undefined
    }
}