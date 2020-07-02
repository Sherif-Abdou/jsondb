import { v4 as uuidv4 } from "uuid";
import Column from "./column";

export default class Table {
    id: string;
    name: string;
    columns: Column[];
    rows: string[];
    constructor() {
        this.id = uuidv4();
        this.name = "";
        this.columns = [];
        this.rows = [];
    }

    toJSONString(): string {
        return JSON.stringify(this);
    }
}
