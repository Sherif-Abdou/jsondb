import Table from "../../src/json/table";
import Item from "../../src/json/item";
import Column from "../../src/json/column";

test("Table initalizes successfully", () => {
    const table = new Table();
    expect(table.name).toEqual("");
    expect(table.columns).toEqual([]);
});

test("Table can stringify", () => {
    const table = new Table();
    const result = table.toJSONString();
});

test("Table can stringify with columns and items", () => {
    const table = new Table();
    const columns: Column[] = new Array(2)
        .fill(undefined)
        .map(v => new Column());
    table.columns = columns;
    const items: Item[] = new Array(5)
        .fill(undefined)
        .map(v => new Item("test"));
    table.columns[0].items = items;
});
