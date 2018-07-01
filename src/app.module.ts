import { Module, Logger } from '@nestjs/common';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosRepository } from './todos/todos.repository';
import { ConfigService } from './config.service';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Neo4jService } from './shared/neo4j.service';

const environmentArgument = process.argv.find(x => x.startsWith('--env='));
const environment = environmentArgument ? environmentArgument.split('=')[1] : 'prod';

@Module({
  imports: [],
  controllers: [
    TodosController
  ],
  providers: [
    TodosService,
    TodosRepository,
    {
      provide: ConfigService,
      useValue: new ConfigService(`config/${environment}.env`)
    },
    Neo4jService,
    Logger
  ]
})
export class AppModule { }
