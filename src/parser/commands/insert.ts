import Command, { CommandResult } from "../command";
import { parse_columns, ColumnSearch } from "../command_utils";
import { v4 as uuidv4 } from "uuid";
import Item, { ItemType } from "../../json/item";
import Column from "../../json/column";

class InsertCommand extends Command {
    table_name: string;
    column_search: ColumnSearch;
    column_values: ItemType[];
    mutates_state: boolean = true;

    private raw_values_to_values(raw: string[]): ItemType[] {
        return raw.map(value => {
            let parsed_number = parseFloat(value);
            if (parsed_number !== NaN) {
                return parsed_number;
            }
            return value;
        });
    };

    parse_tokens(tokens: string[]) {
        if (tokens[0].toLowerCase() !== "insert" ||
            tokens[1].toLowerCase() !== "into") { throw new Error("No insert into present") };

        let table_name = tokens[2];
        if (table_name === undefined) throw new Error("No table name given");

        let column_search: ColumnSearch = undefined;
        let value_token_index = -1;
        if (tokens[3] === "values") {
            column_search = "All";
            value_token_index = 3;
        } else if (tokens[3] === "(") {
            let end_paranth = tokens.findIndex((v, i) => v === ")" && i > 3);
            column_search = parse_columns(tokens.slice(4, end_paranth));
            value_token_index = end_paranth + 1;
            if (tokens[value_token_index] !== "values") throw new Error("Missing value keyword");
        } else {
            throw new Error("Unexpected token after table");
        }
        if (tokens[value_token_index + 1] !== "(") throw new Error("Missing value parenthesis: got token");

        value_token_index += 1;

        let end_value_parenth_index = tokens.indexOf(")", value_token_index);
        let raw_values = parse_columns(tokens.slice(value_token_index + 1, end_value_parenth_index));

        this.table_name = table_name;
        this.column_search = column_search;
        this.column_values = this.raw_values_to_values(raw_values as string[]);
    }

    run(): CommandResult {
        let table = this.manager.tables.find(v => v.name === this.table_name);
        if (table === undefined) throw new Error(`Can't find table ${this.table_name}`);
        let search_columns: Column[] = null;
        if (this.column_search === "All") {
            search_columns = table.columns.map(v => v);
        } else {
            search_columns = table.columns.filter(v => (this.column_search as string[]).includes(v.title) );
        }

        if (search_columns.length !== this.column_values.length) {
            throw new Error(`Columns and values are different lengths: ${search_columns.length} ${this.column_values.length}`)
        };

        let row_id = uuidv4();

        search_columns.map((v, i) => {
            let item = new Item(row_id);
            item.value = this.column_values[i];
            v.items.push(item);
        });

        return this.manager.tables.map(v => {
            if (v.id === table.id) return table;
            return v;            
        });
    }
}

export default InsertCommand;
