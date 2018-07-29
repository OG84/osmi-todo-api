import { Injectable, Logger } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import { Driver, Result, StatementResult } from 'neo4j-driver/types/v1';
import { Observable, from, of, EMPTY, timer, Subject, interval } from 'rxjs';
import { tap, catchError, map, takeUntil } from 'rxjs/operators';

@Injectable()
export class Neo4jService {
    neo4jReady = new Subject();
    private driver: Driver;

    constructor(private readonly logger: Logger) {
        const environmentArgument = process.argv.find(x => x.startsWith('--env='));
        const environment = environmentArgument ? environmentArgument.split('=')[1] : 'prod';

        const neo4jAuth = process.env.NEO4J_AUTH;
        const username = neo4jAuth.split('/')[0];
        const password = neo4jAuth.split('/')[1];

        const connectionString = `bolt://${environment === 'dev' ? 'localhost' : 'neo4j'}:7687`;

        this.neo4jReady.subscribe(x =>
            this.logger.log('neo4j connection established.'));

        // asynchronously check every second for the neo4j connection
        interval(1000)
            .pipe(takeUntil(this.neo4jReady))
            .subscribe(x => {
                try {
                    this.driver = neo4j.v1.driver(
                        connectionString,
                        neo4j.v1.auth.basic(username, password));
                    neo4jReady.next();
                    neo4jReady.complete();
                } catch (err) {
                    this.logger.warn('no neo4j connection available yet, trying again...');
                }
            });
    }

    query(query: string, parameters?: any): Observable<StatementResult> {
        const session = this.driver.session();

        const resultPromise = session.run(query, parameters);
        return from(resultPromise.then()).pipe(
            tap(x => session.close())
        );
    }
}