import Command, { CommandResult } from "../command";
import JSONManager from "../../json/json_manager";
import { parse_columns } from "../command_utils";
import Table from "../../json/table";
import Column from "../../json/column";

class CreateTableCommand extends Command {
    mutates_state = true;
    table_name: string;
    columns: string[];

    parse_tokens(tokens: string[]): void {
        if (tokens[0] === undefined || tokens[0].toLowerCase() !== "create") throw new Error("Missing create keyword");
        if (tokens[1] === undefined || tokens[1].toLowerCase() !== "table") throw new Error("Missing table keyword");

        if (tokens[2] === undefined) throw new Error("Missing table name");
        const table_name = tokens[2];

        if (tokens[3] !== "(") throw new Error("Missing parenthesis");
        const end_parenth = tokens.indexOf(")");
        const columns = parse_columns(tokens.slice(3, end_parenth - 1)) as string[];

        this.table_name = table_name;
        this.columns = columns;
    }

    run(manager: JSONManager): CommandResult {
        let table = new Table();
        table.name = this.table_name;
        table.columns = this.columns.map(column_name => new Column(column_name));

        return manager.tables.map(t => t).concat([table]);
    }
}

export default CreateTableCommand;