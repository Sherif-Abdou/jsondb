import InsertCommand from "./insert";
import tokenize from "../tokenizer";
import JSONManager from "../../json/json_manager";
import Table from "../../json/table";
import Column from "../../json/column";
import Item from "../../json/item";

test("Insert command can parse with all columns", () => {
    let tokens = tokenize("insert into table1 values (1, 2);");  
    let insert_command = new InsertCommand(null);
    insert_command.parse_tokens(tokens);
    expect(insert_command.column_values).toEqual([1, 2]);
    expect(insert_command.column_search).toEqual("All");
});

test("Insert command can parse with some columns", () => {
    let tokens = tokenize("insert into table1 (a, b) values (1, 2);");  
    let insert_command = new InsertCommand(null);
    insert_command.parse_tokens(tokens);
    expect(insert_command.column_values).toEqual([1, 2]);
    expect(insert_command.column_search).toEqual(["a", "b"]);
});

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

test("Insert command can run", () => {
    let tokens = tokenize("insert into students (a, b) values (1, 2);");  
    let manager = create_manager();
    let insert_command = new InsertCommand(manager);
    insert_command.parse_tokens(tokens);

    let result = insert_command.run() as Table[];
    expect(result[0].columns[1].items[0].value).toEqual(2);
});

test("Insert command can run with all columns", () => {
    let tokens = tokenize("insert into students values (1, 2);");  
    let manager = create_manager();
    let insert_command = new InsertCommand(manager);
    insert_command.parse_tokens(tokens);

    let result = insert_command.run() as Table[];
    expect(result[0].columns[1].items[0].value).toEqual(2);
});
