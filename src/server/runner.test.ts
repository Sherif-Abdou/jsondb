import Runner from "./runner";
import JSONManager from "../json/json_manager";
import Table from "../json/table";
import Column from "../json/column";
import Item from "../json/item";
import SelectCommand from "../parser/commands/select";
import { join, resolve } from "path";

function create_manager(): JSONManager {
    let file_path = resolve(join("test_files", "runner_out.json"));
    let manager = new JSONManager(file_path);
    const names = ["a", "b"];

    let table = new Table();
    table.name = "students";
    let columns: Column[] = new Array(2)
        .fill(undefined)
        .map((v, i) => new Column(names[i]));

    table.columns = columns;
    let items: Item[] = new Array(5)
        .fill(undefined)
        .map((v) => new Item("test"));
    table.columns[0].items = items;

    manager.tables.push(table);

    return manager;
}

test("Runner can exist", async () => {
    let manager = create_manager();
    let runner = new Runner(manager);
    console.log(JSON.stringify(manager.tables));
    let tokens = ["select", "*", "from", "students", ";"];
    let command = new SelectCommand();
    command.parse_tokens(tokens);

    let result = await runner.runCommand(command) as Column[];
    expect(result[0].title).toEqual("a");
    expect(result[1].title).toEqual("b");
});

test("Runner can run from string", async () => {
    let manager = create_manager();
    let runner = new Runner(manager);
    let tokens = "select * from students;";
    let result = await runner.run_from_string(tokens) as Column[];
    expect(result[0].title).toEqual("a");
    expect(result[1].title).toEqual("b");
});
