import Manager, {SaveLoader} from "../../src/json/json_manager";
import * as path from "path";
import Table from "../../src/json/table";

let save_loader: SaveLoader

beforeEach(() => {
    const save = jest.fn();
    const load = jest.fn();
    save_loader = {
        save,
        load
    }
    load.mockReturnValue("[]\n")
});

test("Manager can load a file", async () => {
    const file_path = path.resolve(path.join("test_files", "json_manager.json"));
    const manager = new Manager(file_path, save_loader);
    try {
        await manager.load();
        expect(manager.tables).toEqual([]);
        expect(save_loader.load).toHaveBeenCalled()
    } catch(e) {
        throw e
    }
});

test("Manager can save a file", async () => {
    const table = new Table();
    table.name = "2";
    const file_path = path.resolve(path.join("test_files", "json_manager_out.json"));
    const manager = new Manager(file_path, save_loader);
    manager.tables.push(table);
    try {
        await manager.save();
        expect(save_loader.save).toHaveBeenCalled()
    } catch(e) {
        throw e
    }
});
