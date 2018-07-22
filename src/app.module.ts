import { Module, Logger } from '@nestjs/common';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosRepository } from './todos/todos.repository';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Neo4jService } from './shared/neo4j.service';

@Module({
  imports: [],
  controllers: [
    TodosController
  ],
  providers: [
    TodosService,
    TodosRepository,
    Neo4jService,
    Logger
  ]
})
export class AppModule { }
