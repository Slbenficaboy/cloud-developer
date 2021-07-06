import * as uuid from "uuid";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {TodoAccess} from "../dataLayer/todoAccess";
import {TodoItem} from "../models/TodoItem";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {createLogger} from "../utils/logger";

const todoAccess = new TodoAccess()
const logger = createLogger("todos-bl")

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
        logger.info(`New todo item ${newTodo.todoId} created by user ${userId}`)
        delete newTodo['userId']
        return newTodo
    }

    async delete(todoId: string, userId: string) {
        const todo = await todoAccess.findTodo(todoId, userId)
        if (todo) {
            await todoAccess.deleteTodo(todoId, userId);
            logger.info(`Todo ${todoId} deleted by user ${userId}`)
            return todo
        }
        return undefined
    }

    async findAll(userId: string) {
        logger.info(`All todo items requested by ${userId}`)
        return await todoAccess.getTodos(userId)
    }

    async update(todoId: string, updateTodoData: UpdateTodoRequest, userId: string) {
        const oldTodo = await todoAccess.findTodo(todoId, userId)
        if (oldTodo) {
            await todoAccess.updateTodo(todoId, userId, updateTodoData)
            logger.info(`Todo item ${todoId} updated by user ${userId}`)
            return oldTodo
        }
        return undefined
    }

    async createAttachment(todoId: string, userId: string) {
        const todo = await todoAccess.findTodo(todoId, userId)
        if (todo) {
            await todoAccess.attachToTodo(todoId, userId);
            logger.info(`Attachment added to ${todoId} by user ${userId}`)
            return todoAccess.getTodoUploadURL(todoId)
        }
        return undefined
    }
}