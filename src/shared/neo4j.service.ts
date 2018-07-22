import { Injectable, Logger } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import { Driver, Result, StatementResult } from 'neo4j-driver/types/v1';
import { Observable, from, of, EMPTY } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable()
export class Neo4jService {
    private driver: Driver;

    constructor(private readonly logger: Logger) {
        const connectionString = `bolt://localhost`;
        this.driver = neo4j.v1.driver(connectionString, neo4j.v1.auth.basic('neo4j', 'neo4j'));
    }

    query(query: string, parameters?: any): Observable<StatementResult> {
        const session = this.driver.session();

        const resultPromise = session.run(query, parameters);
        return from(resultPromise.then()).pipe(
            tap(x => session.close())
        );
    }
}