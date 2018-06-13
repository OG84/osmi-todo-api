import { Get, Controller, Post, Body, Delete, Param, Res, HttpStatus, HttpException, Put, Logger } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Observable } from 'rxjs';
import { Todo } from 'todos/todo.model';
import { TodoDto } from './todo.dto';
import { catchError, switchMap } from 'rxjs/operators';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';
import { DuplicateTodoException } from '../exceptions/duplicate-todo.exception';

@Controller('api/v1/todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly logger: Logger) { }

  @Get()
  getAll(): Observable<TodoDto[]> {
    return this.todosService.getAll();
  }

  @Post()
  createRoot(@Body() todo): Observable<TodoDto> {
    return this.todosService.upsert(todo);
  }

  @Post(':parentTodoId')
  createChild(@Param('parentTodoId') parentTodoId: string, @Body() todo: TodoDto): Observable<TodoDto> {
    return this.todosService.getAll().pipe(
      switchMap(todos => {
        for (const rootTodo of todos) {
          const parentTodo = this.findTodoById(rootTodo, parentTodoId);

          if (parentTodo) {
            const existingTodo = parentTodo.todos.find(x => x.name === todo.name);
            if (existingTodo) {
              throw new DuplicateTodoException('');
            }

            todo.parentId = parentTodoId;
            parentTodo.todos.push(todo);
            return this.todosService.upsert(rootTodo);
          }
        }

        throw new TodoNotFoundException('');
      })
    );
  }

  @Put(':todoId')
  update(@Param('todoId') todoId: string, @Body() todo): Observable<TodoDto> {
    //TODO
    return this.todosService.upsert(todo);
  }

  @Delete(':todoId')
  delete(@Param('todoId') todoId: string): void {
    this.todosService.delete(todoId);
  }

  private findTodoById(todo: TodoDto, id: string): TodoDto {
    if (todo._id.toString() === id) {
      return todo;
    }

    for (const childTodo of todo.todos) {
      if (todo._id.toString() === id) {
        return todo;
      }

      const childChildTodo = this.findTodoById(childTodo, id);
      if (childChildTodo) {
        return childChildTodo;
      }
    }

    return null;
  }
}
