import {
  Get,
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Res,
  HttpStatus,
  HttpException,
  Put,
  Logger,
  Query,
  UseFilters,
  BadRequestException
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Observable, of } from 'rxjs';
import { TodoDto } from './todo.dto';
import { catchError, switchMap } from 'rxjs/operators';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';
import { DuplicateTodoException } from '../exceptions/duplicate-todo.exception';
import { UpdateTodoException } from '../exceptions/update-todo.exception';
import { Neo4jService } from '../shared/neo4j.service';
import { Result } from 'neo4j-driver/types/v1';

@Controller('api/v1/todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly logger: Logger,
    private readonly neo4jService: Neo4jService) { }

  @Get()
  getAll(@Query('parentId') parentId: string): Observable<TodoDto[]> {
    if (parentId) {
      return this.todosService.getByParentId(parentId);
    }

    return this.todosService.getRoots();
  }

  @Get(':todoId')
  getById(@Param('todoId') todoId: string): Observable<TodoDto> {
    return this.todosService.getById(todoId);
  }

  @Post()
  create(
    @Body() todo: TodoDto,
    @Query('copyChildrenFromId') copyChildrenFromId: string): Observable<TodoDto> {

    if (todo.id) {
      throw new BadRequestException('id required');
    }

    if (todo.id === null || todo.id === undefined) {
      delete todo.id;
    }

    return this.todosService.create(todo, copyChildrenFromId);
  }

  @Put(':todoId')
  update(@Param('todoId') todoId: string, @Body() todo: TodoDto): Observable<TodoDto> {
    if (!todoId) {
      throw new BadRequestException('todoId path param required');
    }

    if (todoId !== todo.id) {
      throw new BadRequestException('todoId path param does not match body');
    }

    if (todo.id === todo.parentId) {
      throw new BadRequestException('todo cannot have itself as parent');
    }

    return this.todosService.update(todo);
  }

  @Delete(':todoId')
  delete(@Param('todoId') todoId: string): Observable<TodoDto> {
    return this.todosService.delete(todoId);
  }
}
