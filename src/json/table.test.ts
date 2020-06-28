import Table from "./table";
import Item from "./item";
import Column from "./column";

test("Table initalizes successfully", () => {
    let table = new Table();
    expect(table.name).toEqual("");
    expect(table.columns).toEqual([]);
});

test("Table can stringify", () => {
    let table = new Table();
    console.log(table.toJSONString());
});

test("Table can stringify with columns and items", () => {
    let table = new Table();
    let columns: Column[] = new Array(2)
        .fill(undefined)
        .map(v => new Column());
    table.columns = columns;
    let items: Item[] = new Array(5)
        .fill(undefined)
        .map(v => new Item("test"));
    table.columns[0].items = items;
});
