import JSONManager from "../../json/json_manager";
import Table from "../../json/table";
import Column from "../../json/column";
import Item from "../../json/item";
import UpdateCommand from "./update";
import tokenize from "../tokenizer";

function create_manager(): JSONManager {
    let manager = new JSONManager("");
    const names = ["a", "b"];

    let table = new Table();
    table.name = "students";
    let columns: Column[] = new Array(2)
        .fill(undefined)
        .map((v, i) => new Column(names[i]));

    table.columns = columns;
    let items: Item[] = new Array(5)
        .fill(undefined)
        .map(v => new Item("test"));
    table.columns[0].items = items;

    manager.tables.push(table);

    return manager;
}

test("Update can parse tokens", () => {
    const manager = create_manager();
    const tokens = tokenize("update students set a=2 where a=test");

    const select = new UpdateCommand();
    select.parse_tokens(tokens);

    console.log(select);
})