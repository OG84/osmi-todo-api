export interface TodoDto {
    _id?: string;
    parentId: string;
    name: string;
    todos: TodoDto[];
}