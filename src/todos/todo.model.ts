import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Todo extends Document {
    name: string;
    todos: Todo[];
}

export const todoSchema = new mongoose.Schema();

todoSchema.add({
    name: {
        type: mongoose.SchemaTypes.String,
        unique: true
    },
    todos: [todoSchema]
});

export const todoCollectionName = 'Todo';