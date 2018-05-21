import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, todoCollectionName, todoSchema } from './todos/todo.model';
import { TodosRepository } from './todos/todos.repository';
import { ConfigService } from './config/config.service';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const environmentArgument = process.argv.find(x => x.startsWith('--env='));
const environment = environmentArgument ? environmentArgument.split('=')[1] : 'prod';

@Module({
  imports: [
    // the docker mongo container has the hostname 'mongo' in production stack
    // for local development the api is not part of the docker network, so use localhost
    MongooseModule.forRoot(`mongodb://${environment === 'dev' ? 'localhost' : 'mongo' }/thodo`),
    MongooseModule.forFeature([{ name: todoCollectionName, schema: todoSchema }])
  ],
  controllers: [
    AppController,
    TodosController
  ],
  providers: [
    AppService,
    TodosService,
    TodosRepository,
    {
      provide: ConfigService,
      useValue: new ConfigService(`src/config/${environment}.env`)
    }
  ]
})
export class AppModule { }
