import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Todo extends Document {
    parentId: string;
    name: string;
    todos: Todo[];
}

export const todoSchema = new mongoose.Schema();

todoSchema.add({
    parentId: {
        type: mongoose.SchemaTypes.ObjectId
    },
    name: {
        type: mongoose.SchemaTypes.String,
        unique: true
    },
    todos: [todoSchema]
});

export const todoCollectionName = 'Todo';