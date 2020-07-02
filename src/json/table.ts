import { v4 as uuidv4 } from "uuid";
import Column from "./column";
import Item from "./item";

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

        this.toJSONString = this.toJSONString.bind(this);
        this.get_row_values = this.get_row_values.bind(this);
    }

    toJSONString(): string {
        return JSON.stringify(this);
    }

    get_row_values(row_ids: string[]): Item[][] {
        return row_ids.map(row => {
            let values = [];
            this.columns.forEach(column => {
                column.items.map(i => i).forEach(item => {
                    if (item.row_id === row) {
                        values.push(item)
                    }
                })
            });
            return values;
        });
    }
}
