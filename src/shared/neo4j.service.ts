import { Injectable, Logger } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import { Driver, Result, StatementResult } from 'neo4j-driver/types/v1';
import { Observable, from, of, EMPTY } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable()
export class Neo4jService {
    private driver: Driver;

    constructor(private readonly logger: Logger) {
        const environmentArgument = process.argv.find(x => x.startsWith('--env='));
        const environment = environmentArgument ? environmentArgument.split('=')[1] : 'prod';

        const neo4jAuth = process.env.NEO4J_AUTH;
        const username = neo4jAuth.split('/')[0];
        const password = neo4jAuth.split('/')[1];
        this.driver = neo4j.v1.driver(
            `bolt://${environment === 'dev' ? 'localhost' : 'todo-neo4j.todo-api-stack'}:7687`,
            neo4j.v1.auth.basic(username, password));
    }

    query(query: string, parameters?: any): Observable<StatementResult> {
        const session = this.driver.session();

        const resultPromise = session.run(query, parameters);
        return from(resultPromise.then()).pipe(
            tap(x => session.close())
        );
    }
}