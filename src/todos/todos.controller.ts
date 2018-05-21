import { Get, Controller } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Observable } from 'rxjs';
import { Todo } from 'todos/todo.model';
import { TodoDto } from './todo.dto';

@Controller('api/v1/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Get()
  getAll(): Observable<TodoDto[]> {
    return this.todosService.getAll();
  }
}
