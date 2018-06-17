import { Document, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Observable } from 'rxjs';

export interface Todo extends Document {
    parentId: string;
    name: string;
    dueDate: string;

    findParent(): Promise<Todo>;
}

export interface TodoModel extends Model<Todo> {
    findRoots(): Promise<Todo[]>;
    findByParentId(parentId: string): Promise<Todo[]>;
}

export const todoSchema = new mongoose.Schema();

todoSchema.add({
    parentId: {
        type: mongoose.SchemaTypes.ObjectId,
        index: true
    },
    name: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true
    },
    dueDate: {
        type: mongoose.SchemaTypes.Date,
        index: true
    }
});

todoSchema.methods.findParent = function (cb) {
    return this.model(todoCollectionName).find({ _id: this.parentId }, cb);
};

todoSchema.statics.findRoots = function (cb) {
    return this.find({ parentId: null }, cb);
};

todoSchema.statics.findByParentId = function (parentId: string, cb) {
    return this.find({ parentId: parentId }, cb);
}

export const todoCollectionName = 'Todo';