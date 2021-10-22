export enum Severity {
    LOW,
    MEDIUM,
    HIGH
}

export class Command {
    id: string;
    name: string;
    query: string;
    severity: Severity

    constructor(id: string, name: string, query: string, severity: Severity) {
        this.id = id;
        this.name = name;
        this.query = query;
        this.severity = severity;
    }
}