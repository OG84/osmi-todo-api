import * as mongoose from 'mongoose';

export class Todo {
    id?: string;
    name: string;

    static schema = new mongoose.Schema({
        id: mongoose.SchemaTypes.ObjectId,
        name: {
            type: mongoose.SchemaTypes.String,
            unique: true
        }
    });

    static collectionName = 'Todo';
}