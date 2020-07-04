import Command, { CommandResult } from "../command";
import JSONManager from "../../json/json_manager";
import { table } from "console";
import Where from "./where";

class DeleteCommand extends Command {
    mutates_state = true;
    table_name: string;
    condition: Where;

    parse_tokens(tokens: string[]): void {
        if (tokens[0] === undefined || tokens[0].toLowerCase() !== "delete") {
            throw new Error("Mising delete keyword");
        }
        if (tokens[1] === undefined || tokens[1].toLowerCase() !== "from") {
            throw new Error("Mising from keyword");
        }

        if (tokens[2] === undefined) throw new Error("Missing table_name");

        const table_name = tokens[2];
        if (tokens[3] === undefined) throw new Error("No where clause");
        const subtokens = tokens.slice(3, tokens.length);
        const condition = Where.from_tokens(subtokens);

        this.table_name = table_name;
        this.condition = condition;
    }

    run(manager: JSONManager): CommandResult {
        let table = manager.tables.map(t => t).find(t => t.name === this.table_name);
        const row_ids = this.condition.to_rows(table.columns);
        table.columns = table.columns.map(column => {
            column.items = column.items.filter(item => !row_ids.includes(item.row_id));
            return column;
        });
        return manager.tables.map(t => {
            if (t.id === table.id) {
                return table;
            }
            return t;
        })
    }
}

export default DeleteCommand;