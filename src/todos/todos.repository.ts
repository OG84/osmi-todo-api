import { Todo } from './todo.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, of, from, throwError, EMPTY } from 'rxjs';
import { TodoDto } from './todo.dto';
import { map, catchError, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { CreateTodoException } from '../exceptions/create-todo.exception';
import { UpdateTodoException } from '../exceptions/update-todo.exception';
import { DuplicateTodoException } from '../exceptions/duplicate-todo.exception';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';
import { Neo4jService } from 'shared/neo4j.service';
import * as uuid from 'node-uuid';
import { StatementResult } from 'neo4j-driver/types/v1';

@Injectable()
export class TodosRepository {
    constructor(
        private readonly logger: Logger,
        private readonly neo4jService: Neo4jService) {

        this.createConstraints().pipe(
            switchMap(x => this.initDefaultNodes())
        ).subscribe();
    }

    findRoots(): Observable<Todo[]> {
        this.logger.log(`findRoots`);

        const query = `match (root:Todo)-[:HAS_PARENT]->(notebook:Notebook)
        return root, null as parentId`;

        return this.neo4jService.query(query).pipe(
            this.mapToTodos('root')
        );
    }

    findById(_id: string): Observable<TodoDto> {
        this.logger.log(`findById: ${_id}`);

        const query = `match (todo:Todo {id: $id})
        optional match (todo)-[:HAS_PARENT]->(parent:Todo)
        return todo, parent.id as parentId`;

        return this.neo4jService.query(query, { id: _id }).pipe(
            this.mapToTodo('todo')
        );
    }

    findByParentId(_parentId: string): Observable<TodoDto[]> {
        this.logger.log(`findByParentId: ${_parentId}`);

        const query = `match (todo:Todo)-[:HAS_PARENT]->(parent:Todo {id: $parentId})
        return todo, parent.id as parentId`;

        return this.neo4jService.query(query, { parentId: _parentId }).pipe(
            this.mapToTodos('todo')
        );
    }

    create(todo: TodoDto): Observable<Todo> {
        this.logger.log(`create: ${JSON.stringify(todo)}`);

        if (todo.parentId) {
            return this.createChildTodo(todo);
        }

        return this.createRootTodo(todo);
    }

    update(todo: TodoDto): Observable<Todo> {
        this.logger.log(`update: ${JSON.stringify(todo)}`);

        const query = `match (todo:Todo {id: $id})
        optional match (todo)-[:HAS_PARENT]->(parent:Todo)
        set todo.name=$name, todo.dueDate=$dueDate
        return todo, parent.id as parentId`;

        return this.neo4jService.query(query, todo).pipe(
            catchError(err => {
                throw new UpdateTodoException(err);
            }),
            this.mapToTodo('todo')
        );
    }

    delete(todoId: string): Observable<any> {
        this.logger.log(`delete ${todoId}`);

        const deleteTodoQuery = `match (todo:Todo {id: $id})
        detach delete todo`;

        const deleteOrphanTodosQuery = `match (n:Todo)
        where not((n)-[*]-(:Notebook))
        detach delete n`;

        return this.neo4jService.query(deleteTodoQuery, { id: todoId }).pipe(
            switchMap(x => this.neo4jService.query(deleteOrphanTodosQuery)),
            map(x => EMPTY)
        );
    }

    private createRootTodo(todo: TodoDto): Observable<Todo> {
        const newId = uuid.v4();
        const query = `match (notebook:Notebook {id: $notebookId})
        create (newTodo:Todo {
            id: $id,
            name: $name,
            dueDate: $dueDate
        })-[:HAS_PARENT]->(notebook)
        return newTodo, null as parentId`;

        return this.isRootWithNameExisting(todo.name).pipe(
            tap(isNameExisting => {
                if (isNameExisting) {
                    throw new DuplicateTodoException(todo);
                }
            }),
            switchMap(x => this.neo4jService.query(query, { ...todo, id: newId, notebookId: 'defaultNotebook' })),
            this.mapToTodo('newTodo'),
            catchError(err => {
                if (err instanceof DuplicateTodoException) {
                    throw err;
                }

                throw new CreateTodoException(err);
            })
        );
    }

    private createChildTodo(todo: TodoDto): Observable<Todo> {
        const newId = uuid.v4();
        const query = `match (parent:Todo {id: $parentId})
            create (newTodo:Todo {
                id: $id,
                name: $name,
                dueDate: $dueDate
            })-[:HAS_PARENT]->(parent)
            return newTodo, $parentId as parentId`;

        return this.isChildWithNameExisting(todo.name, todo.parentId).pipe(
            tap(isNameExisting => {
                if (isNameExisting) {
                    throw new DuplicateTodoException(todo);
                }
            }),
            switchMap(x => this.neo4jService.query(query, { ...todo, id: newId })),
            this.mapToTodo('newTodo'),
            catchError(err => {
                if (err instanceof DuplicateTodoException) {
                    throw err;
                }

                throw new CreateTodoException(err);
            })
        );
    }

    private isRootWithNameExisting(_name: string): Observable<boolean> {
        const query = `match (root:Todo {name: $name})-[:HAS_PARENT]->(notebook:Notebook)
        return case when count(root)=0 then false else true end as isExisting`;

        return this.neo4jService.query(query, { name: _name }).pipe(
            map(x => {
                if (x.records.length === 0) {
                    return false;
                }

                return x.records[0].get('isExisting') as boolean;
            })
        );
    }

    private isChildWithNameExisting(_name: string, _todoId: string): Observable<boolean> {
        const query = `match (a:Todo {name: $name})-->(:Todo {id: $todoId})
        return case when count(a)=0 then false else true end as isExisting`;

        return this.neo4jService.query(query, { name: _name, todoId: _todoId }).pipe(
            map(x => {
                if (x.records.length === 0) {
                    return false;
                }

                return x.records[0].get('isExisting') as boolean;
            })
        );
    }

    private createConstraints(): Observable<StatementResult> {
        return this.neo4jService.query(`CREATE CONSTRAINT ON (todo:Todo) ASSERT todo.id IS UNIQUE`).pipe(
            switchMap(x => this.neo4jService.query(`CREATE CONSTRAINT ON (notebook:Notebook) ASSERT notebook.id IS UNIQUE`))
        );
    }

    private initDefaultNodes(): Observable<StatementResult> {
        return this.neo4jService.query(`create (newNotebook:Notebook {
            id: $id,
            name: $name
        })`, { id: 'defaultNotebook', name: 'Notebook 1' }).pipe(
            catchError(err => EMPTY)
        );
    }

    private mapToTodos = (nodeName: string) =>
        map((x: StatementResult) => {
            return x.records.map(record => {
                const todoNode = record.get(nodeName);
                const _parentId = x.records[0].get('parentId');
                const todo: Todo = {
                    id: todoNode.properties.id,
                    name: todoNode.properties.name,
                    parentId: _parentId,
                    dueDate: todoNode.properties.dueDate
                };
                return todo;
            });
        })

    private mapToTodo = (nodeName: string) =>
        map((x: StatementResult) => {
            if (x.records.length === 0) {
                throw new TodoNotFoundException();
            }
            const todoNode = x.records[0].get(nodeName);
            const _parentId = x.records[0].get('parentId');
            const todo: Todo = {
                id: todoNode.properties.id,
                name: todoNode.properties.name,
                parentId: _parentId,
                dueDate: todoNode.properties.dueDate
            };
            return todo;
        })
    // TODO: add mapping exception instead of creationexception
}