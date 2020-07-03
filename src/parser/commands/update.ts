import Command, { CommandResult } from "../command";
import JSONManager from "../../json/json_manager";
import { ItemType } from "../../json/item";
import { value_to_itemtype, parse_columns } from "../command_utils";
import Where from "./where";
import { table } from "console";

export type Assignment = {
    column_name: string,
    value: ItemType
}

class UpdateCommand extends Command {
    mutates_state = true;
    table_name: string;
    assignments: Assignment[];
    condition: Where;

    private static indexesOf(token: string, tokens: string[]): number[] {
        let array = [];

        tokens.forEach((value, i) => {
            if (value === token) {
                array.push(i)
            }
        });

        return array
    }

    private static parse_column(tokens: string[]): Assignment {
        const column_name = tokens[0];
        if (column_name === undefined) throw new Error("Missing column name");

        if (tokens[1] !== "=") throw new Error(`Unexpected token: ${tokens[1]}`);

        if (tokens[2] === undefined) throw new Error("Missing item after =");

        const value = value_to_itemtype(tokens[2])

        return {
            value,
            column_name
        }
    }

    private static parse_column_values(tokens: string[]): Assignment[] {
        let assignments = [];

        const commas = UpdateCommand.indexesOf(",", tokens);
        let i = 0;
        let previous_index = 0;
        for (; i < commas.length - 1; i++) {
            const comma_index = commas[i];

            const sub_tokens = tokens.slice(previous_index, comma_index);
            assignments.push(this.parse_column(sub_tokens));

            i = comma_index + 1;
        }
        const sub_tokens = tokens.slice(i, tokens.length);
        assignments.push(this.parse_column(sub_tokens));

        return assignments;
    }

    parse_tokens(tokens: string[]): void {
        if (tokens[0] === undefined || tokens[0].toLowerCase() !== "update") throw new Error("Missing update keyword");

        if (tokens[1] === undefined) throw new Error("Missing table name");
        const table_name = tokens[1];

        const where_index = tokens.findIndex(v => v.toLowerCase() === "where");

        if (where_index === -1) throw new Error("Couldn't find where keyword");

        const assignments = UpdateCommand.parse_column_values(tokens.slice(3, where_index));

        const condition = Where.from_tokens(tokens.slice(where_index, tokens.length));

        this.table_name = table_name;
        this.assignments = assignments;
        this.condition = condition;
    }

    run(manager: JSONManager): CommandResult {
        const table = manager.tables.map(v => v).find(table => table.name === this.table_name);
        if (table === undefined) throw new Error("Couldn't find table");
        const row_ids = this.condition.to_rows(table.columns);

        const columns_to_change = this.assignments.map(assignment => assignment.column_name);
        table.columns.forEach(column => {
            if (columns_to_change.includes(column.title)) {
                column.items.forEach(item => {
                    if (row_ids.includes(item.row_id)) {
                        const assignment = this.assignments.find(a => a.column_name === column.title);
                        item.value = assignment.value;
                    }
                });
            }
        });

        return manager.tables.map(t => {
            if (t.id === table.id) return table;
            return t;
        });
    }
}

export default UpdateCommand;