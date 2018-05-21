import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Todo extends Document {
    id?: string;
    name: string;
}

export const todoSchema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    name: {
        type: mongoose.SchemaTypes.String,
        unique: true
    }
});

export const todoCollectionName = 'Todo';