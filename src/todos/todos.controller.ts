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
    this.logger.log('111');
    return this.todosService.getAll().pipe(
      switchMap(todos => {
        for (const rootTodo of todos) {
          const parentTodo = this.todosService.findTodoById(rootTodo, parentTodoId);
          if (!parentTodo) {
            continue;
          }

          const existingTodo = this.todosService.findTodoById(parentTodo, todo._id);

          if (existingTodo && todo.parentId !== parentTodoId) {
            throw new HttpException('parent id not matching with existing one', HttpStatus.BAD_REQUEST);
          }

          const todoWithSameName = parentTodo.todos.find(x => x.name === todo.name);
          if (todoWithSameName) {
            throw new DuplicateTodoException('');
          }

          todo.parentId = parentTodoId;

          if (!existingTodo) {
            parentTodo.todos.push(todo);
          } else {
            const indexOfExistingTodo = parentTodo.todos.findIndex(x => x._id.toString() === todo._id);
            parentTodo.todos[indexOfExistingTodo] = todo;
          }

          return this.todosService.upsert(rootTodo);
        }


        throw new TodoNotFoundException(`id ${parentTodoId} not found`);
      })
    );
  }

  /*@Put(':todoId')
  update(@Param('todoId') todoId: string, @Body() todo): Observable<TodoDto> {
    //TODO
    return this.todosService.upsert(todo);
  }*/

  @Delete(':todoId')
  delete(@Param('todoId') todoId: string): void {
    this.todosService.delete(todoId);
  }
}
