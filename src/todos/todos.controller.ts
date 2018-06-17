import { Get, Controller, Post, Body, Delete, Param, Res, HttpStatus, HttpException, Put, Logger, Query, UseFilters } from '@nestjs/common';
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
    return this.todosService.getRoots();
  }

  @Get(':todoId')
  getById(@Param('todoId') todoId: string): Observable<TodoDto> {
    return this.todosService.getById(todoId);
  }

  @Post()
  createRoot(@Body() todo: TodoDto): Observable<TodoDto> {
    return this.todosService.upsert(todo);
  }

  @Delete(':todoId')
  delete(@Param('todoId') todoId: string): Observable<void> {
    return this.todosService.delete(todoId);
  }
}
