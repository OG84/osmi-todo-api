export interface TodoDto {
    _id?: string;
    name: string;
    todos: TodoDto[];
}