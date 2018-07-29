import { Injectable, Logger } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import { Driver, Result, StatementResult } from 'neo4j-driver/types/v1';
import { Observable, from, of, EMPTY, timer, Subject, interval } from 'rxjs';
import { tap, catchError, map, takeUntil, delay, delayWhen } from 'rxjs/operators';

@Injectable()
export class Neo4jService {
    private driver: Driver;

    constructor(private readonly logger: Logger) {

    }

    query(query: string, parameters?: any): Observable<StatementResult> {
        if (!this.driver) {
            this.initDriver();
        }

        const session = this.driver.session();

        const resultPromise = session.run(query, parameters);
        return from(resultPromise.then()).pipe(
            tap(x => session.close())
        );
    }

    private initDriver(): void {
        const environmentArgument = process.argv.find(x => x.startsWith('--env='));
        const environment = environmentArgument ? environmentArgument.split('=')[1] : 'prod';

        const neo4jAuth = process.env.NEO4J_AUTH;
        const username = neo4jAuth.split('/')[0];
        const password = neo4jAuth.split('/')[1];

        const connectionString = `bolt://${environment === 'dev' ? 'localhost' : 'neo4j'}:7687`;

        this.driver = neo4j.v1.driver(
            connectionString,
            neo4j.v1.auth.basic(username, password));
    }
}