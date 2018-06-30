import { Injectable, Logger } from '@nestjs/common';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Todo, todoSchema } from '../todos/todo.model';
import { TodosRepository } from './todos.repository';
import { TodoDto } from './todo.dto';

@Injectable()
export class TodosService {
    constructor(
        private readonly todosRepository: TodosRepository,
        private readonly logger: Logger) {
    }

    getRoots(): Observable<Todo[]> {
        return this.todosRepository.findRoots();
    }

    getById(id: string): Observable<TodoDto> {
        return this.todosRepository.findById(id);
    }

    getByParentId(parentId: string): Observable<TodoDto[]> {
        return this.todosRepository.findByParentId(parentId);
    }

    create(todo: TodoDto, copyChildrenFromId?: string): Observable<Todo> {
        let newTodoObservable = this.todosRepository.create(todo);

        if (copyChildrenFromId) {
            this.logger.log('copying and attaching children from ' + copyChildrenFromId);
            newTodoObservable = newTodoObservable.pipe(
                tap(newDbTodo => {
                    this.copyChildren(copyChildrenFromId, newDbTodo.id);
                })
            );
        }

        return newTodoObservable;
    }

    update(todo: TodoDto): Observable<Todo> {
        return this.todosRepository.update(todo);
    }

    delete(todoId: string): Observable<Todo> {
        return this.todosRepository.delete(todoId);
    }

    private copyChildren(sourceTodoId: string, targetTodoId: string): void {
        this.todosRepository.findByParentId(sourceTodoId).subscribe(todos => {
            for (const todo of todos) {
                const todoCopy: TodoDto = {
                    id: undefined,
                    name: todo.name,
                    parentId: targetTodoId,
                    dueDate: todo.dueDate
                };

                this.logger.log('creating: ' + JSON.stringify(todoCopy));

                this.create(todoCopy, todo.id).subscribe();
            }
        });
    }
}