export interface TodoDto {
    id?: string;
    parentId?: string;
    name: string;
    dueDate: string;
    prio: number;
    dropType?: DropType;
}

export enum DropType {
    BEFORE = 'BEFORE',
    AFTER = 'AFTER'
  }