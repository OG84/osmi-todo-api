// TODO: really needed?
export class Neo4jQueryBuilder {

    matches: string[] = [];
    relations: string[] = [];
    wheres: string[] = [];

    match(nodeName: string, nodeType: string): Neo4jQueryBuilder {
        this.matches.push(`(${nodeName}: ${nodeType})`);

        return this;
    }

    withRelation(relName: string, relType: string): Neo4jQueryBuilder {
        this.relations.push(`-[${relName}:${relType}]->`);

        return this;
    }

    where(expression: string): Neo4jQueryBuilder {
        this.wheres.push(expression);
        return this;
    }

    build(): string {

        let query = `match ${this.matches.join(',')}`;


        return query;
    }
}