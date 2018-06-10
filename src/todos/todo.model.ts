import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Todo extends Document {
    name: string;
}

export const todoSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        unique: true
    }
});

export const todoCollectionName = 'Todo';