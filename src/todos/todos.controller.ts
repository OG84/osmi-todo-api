import { Get, Controller } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Observable } from 'rxjs';
import { Todo } from 'todos/todo.model';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Get()
  getAll(): Observable<Todo[]> {
    return this.todosService.getAll();
  }
}
