import Command, { CommandResult } from "../command";
import Column from "../../json/column";
import { ColumnSearch, parse_columns } from "../command_utils";
import JSONManager from "../../json/json_manager";

class SelectCommand extends Command {
    mutates_state = false;
    column_names: ColumnSearch;
    table_name: string;

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

        this.column_names = column_names;
        this.table_name = table_name;
    }

    run(manager: JSONManager): CommandResult {
        const table = manager.tables.find((v) => v.name === this.table_name);
        if (table === undefined) throw new Error("Missing table name");
        if (this.column_names === "All") {
            return table.columns;
        } else {
            return table.columns.filter((col) =>
                (this.column_names as string[]).includes(col.title)
            );
        }
    }
}

export default SelectCommand;
