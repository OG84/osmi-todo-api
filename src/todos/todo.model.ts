import { Document, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Observable } from 'rxjs';

export interface Todo extends Document {
    parentId: string;
    name: string;

    findParent(): Promise<Todo>;
}

export interface TodoModel extends Model<Todo> {
    findRoots(): Promise<Todo[]>;
}

export const todoSchema = new mongoose.Schema();

todoSchema.add({
    parentId: {
        type: mongoose.SchemaTypes.ObjectId,
        index: true
    },
    name: {
        type: mongoose.SchemaTypes.String,
        unique: true
    }
});

todoSchema.methods.findParent = function (cb) {
    return this.model(todoCollectionName).find({ _id: this.parentId }, cb);
};

todoSchema.statics.findRoots = function (cb) {
    return this.find({ parentId: null }, cb);
};

export const todoCollectionName = 'Todo';