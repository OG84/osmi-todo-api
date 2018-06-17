import { Get, Controller, Post, Body, Delete, Param, Res, HttpStatus, HttpException, Put, Logger, Query, UseFilters, BadRequestException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Observable } from 'rxjs';
import { Todo } from 'todos/todo.model';
import { TodoDto } from './todo.dto';
import { catchError, switchMap } from 'rxjs/operators';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';
import { DuplicateTodoException } from '../exceptions/duplicate-todo.exception';
import { UpdateTodoException } from 'exceptions/update-todo.exception';

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
  create(@Body() todo: TodoDto): Observable<TodoDto> {
    if (todo._id) {
      throw new BadRequestException();
    }

    return this.todosService.create(todo);
  }

  @Put(':todoId')
  update(@Param('todoId') todoId: string, @Body() todo: TodoDto): Observable<TodoDto> {
    if (todoId !== todo._id) {
      throw new BadRequestException();
    }

    return this.todosService.update(todo);
  }

  @Delete(':todoId')
  delete(@Param('todoId') todoId: string): Observable<Todo> {
    return this.todosService.delete(todoId);
  }
}
