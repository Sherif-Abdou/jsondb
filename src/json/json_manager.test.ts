import Manager from "./json_manager";
import * as path from "path";
import Table from "./table";

test("Manager can load a file", async () => {
    let file_path = path.resolve(path.join("test_files", "json_manager.json"));
    let manager = new Manager(file_path);
    try {
        await manager.load();
        expect(manager.tables).toEqual([]);
    } catch(e) {
        console.error(e);
    }
});

test("Manager can save a file", async () => {
    let table = new Table();
    table.name = "2";
    let file_path = path.resolve(path.join("test_files", "json_manager_out.json"));
    let manager = new Manager(file_path);
    manager.tables.push(table);
    try {
        await manager.save(); 
    } catch(e) {
        console.error(e);
    }
});
