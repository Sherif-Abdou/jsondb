import {v4 as uuidv4} from "uuid";

export default class Table {
    id: string;
    name: string;
    columns: any[];
    rows: string[];
    constructor() {
        this.id = uuidv4();
        this.name = "";
        this.columns = [];
        this.rows = [];
    }

    toJSONString() {
        return JSON.stringify(this);
    }
}
