import Command, { CommandResult } from "../command";
import Column from "../../json/column";
import { ColumnSearch, parse_columns } from "../command_utils";


class SelectCommand extends Command {
    mutates_state: boolean = false;
    column_names: ColumnSearch;
    table_name: string;



    parse_tokens(tokens: string[]) {
        if (tokens[0].toLowerCase() != "select") throw new Error("Command isn't a select command");
        if (tokens[1] === undefined) throw new Error("No column name in command");

        let from_index = tokens.map(t => t.toLowerCase()).indexOf("from");

        if (from_index === -1) throw new Error("Missing from keyword");

        let column_names = parse_columns(tokens.slice(1, from_index));

        if (tokens[from_index + 1] === undefined) throw new Error("No table name in command");

        let table_name = tokens[from_index + 1];

        this.column_names = column_names;
        this.table_name = table_name;
    }

    run(): CommandResult {
        let table = this.manager.tables.find(v => v.name === this.table_name);
        if (table === undefined) throw new Error("Missing table name");
        if (this.column_names === "All") {
            return table.columns;
        } else {
            return table.columns.filter(col => (this.column_names as string[]).includes(col.title));
        }
    }
}

export default SelectCommand;
