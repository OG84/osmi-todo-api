import { Injectable, Logger } from '@nestjs/common';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map, tap, switchMap, withLatestFrom, concat } from 'rxjs/operators';
import { TodosRepository } from './todos.repository';
import { TodoDto } from './todo.dto';
import * as uuid from 'node-uuid';

@Injectable()
export class TodosService {
    constructor(
        private readonly todosRepository: TodosRepository,
        private readonly logger: Logger) {
    }

    getRoots(): Observable<TodoDto[]> {
        return this.todosRepository.findRoots();
    }

    getById(id: string): Observable<TodoDto> {
        return this.todosRepository.findById(id);
    }

    getByParentId(parentId: string): Observable<TodoDto[]> {
        return this.todosRepository.findByParentId(parentId);
    }

    create(todo: TodoDto, copyChildrenFromId?: string): Observable<TodoDto> {
        let newTodoObservable = this.todosRepository.create(todo, true);

        if (copyChildrenFromId) {
            this.logger.log('copying and attaching children from ' + copyChildrenFromId);

            newTodoObservable = newTodoObservable.pipe(
                // get all todos we want to copy
                withLatestFrom(this.todosRepository.findAllTodosInPathDownwards(copyChildrenFromId)),
                tap(([newTodo, children]) => {
                    // create an id map of the tree we want to copy
                    const newIdMapping = new Map<string, string>();
                    newIdMapping.set(copyChildrenFromId, newTodo.id);

                    let createTodosObservable: Observable<TodoDto> = EMPTY;
                    for (const child of children) {
                        // generate new ids for each todo we want to copy and map the id of the source todo to the new id
                        if (!newIdMapping.has(child.id)) {
                            const newId = uuid.v4();
                            newIdMapping.set(child.id, newId);
                        }

                        // chain all todo creation operations together
                        const newId = newIdMapping.get(child.id);
                        const newParentId = newIdMapping.get(child.parentId);
                        createTodosObservable = createTodosObservable.pipe(
                            concat(this.todosRepository.create({ ...child, id: newId, parentId: newParentId }, false))
                        );
                    }

                    // execute all async todo creation operations after each other
                    createTodosObservable.subscribe();
                }),
                // return the topmost todo we just created
                map(([newTodo, children]) => newTodo)
            );
        }

        return newTodoObservable;
    }

    update(todo: TodoDto): Observable<TodoDto> {
        return this.todosRepository.update(todo);
    }

    delete(todoId: string): Observable<TodoDto> {
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