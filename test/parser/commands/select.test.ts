import SelectCommand from "../../../src/parser/commands/select";
import JSONManager from "../../../src/json/json_manager";
import Table from "../../../src/json/table";
import Column from "../../../src/json/column";
import Item from "../../../src/json/item";

test("Select Command can parse tokens with one column", () => {
    let tokens = ["select", "names", "from", "customers", ";"];
    let command = new SelectCommand();
    command.parse_tokens(tokens);
    expect(command.column_names).toEqual(["names"]);
    expect(command.table_name).toEqual("customers");
});

test("Select Command can parse tokens with multiple columns", () => {
    let tokens = ["select", "names", ",", "grades", "from", "students", ";"];
    let command = new SelectCommand();
    command.parse_tokens(tokens);
    expect(command.column_names).toEqual(["names", "grades"]);
    expect(command.table_name).toEqual("students");
});

test("Select Command can parse tokens with a wildcard", () => {
    let tokens = ["select", "*", "from", "students", ";"];
    let command = new SelectCommand();
    command.parse_tokens(tokens);
    expect(command.column_names).toEqual("All");
    expect(command.table_name).toEqual("students");
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

test("Select command can run", () => {
    let manager = create_manager();

    let tokens = ["select", "a", "from", "students", ";"];
    let command = new SelectCommand();
    command.parse_tokens(tokens);

    let result = command.run(manager) as Item[][];
});

test("Select command can run", () => {
    let manager = create_manager();

    let tokens = ["select", "*", "from", "students", ";"];
    let command = new SelectCommand();
    command.parse_tokens(tokens);

    let result = command.run(manager) as Item[][];
});
