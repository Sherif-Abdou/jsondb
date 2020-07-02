import Command, { CommandResult } from "../command";
import Column from "../../json/column";
import { ColumnSearch, parse_columns } from "../command_utils";
import JSONManager from "../../json/json_manager";
import Where from "./where";
import Table from "../../json/table";
import Item from "../../json/item";

class SelectCommand extends Command {
    mutates_state = false;
    column_names: ColumnSearch;
    table_name: string;
    condition: Where | null = null;

    parse_tokens(tokens: string[]): void {
        if (tokens[0].toLowerCase() != "select")
            throw new Error("Command isn't a select command");
        if (tokens[1] === undefined)
            throw new Error("No column name in command");

        const from_index = tokens.map((t) => t.toLowerCase()).indexOf("from");

        if (from_index === -1) throw new Error("Missing from keyword");

        const column_names = parse_columns(tokens.slice(1, from_index));

        if (tokens[from_index + 1] === undefined)
            throw new Error("No table name in command");

        const table_name = tokens[from_index + 1];

        let where = "";

        if ((where = tokens[from_index + 2]) !== undefined && where.toLowerCase() === "where") {
            this.condition = Where.from_tokens(tokens.slice(from_index + 2, tokens.length - 1));
        }

        this.column_names = column_names;
        this.table_name = table_name;
    }

    private get_columns(table: Table): Column[] {
        if (this.column_names === "All") {
            return table.columns;
        } else {
            return table.columns.filter((col) =>
                (this.column_names as string[]).includes(col.title)
            );
        }
    }

    run(manager: JSONManager): CommandResult {
        const table: Table = manager.tables.find((v) => v.name === this.table_name) as Table;
        if (table === undefined) throw new Error("Missing table name");
        const columns = this.get_columns(table);
        if (this.condition === null) {
            let rows: string[] = [];
            columns.forEach(column => {
                column.items.forEach(item => {
                    if (!rows.includes(item.row_id)) {
                        rows.push(item.row_id);
                    }
                });
            });
            return table.get_row_values(rows);
        } else {
            const rows = this.condition.to_rows(columns);
            return table.get_row_values(rows);
        }
    }
}

export default SelectCommand;
