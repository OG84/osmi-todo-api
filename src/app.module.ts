import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo } from './todos/todo.model';
import { TodosRepository } from './todos/todos.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/thodo'),
    MongooseModule.forFeature([{name: Todo.collectionName, schema: Todo.schema}])
  ],
  controllers: [
    AppController,
    TodosController
  ],
  providers: [
    AppService,
    TodosService,
    TodosRepository
  ]
})
export class AppModule { }
