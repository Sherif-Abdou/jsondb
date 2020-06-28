import Column from "./column";

test("Column initializes", () => {
    let column = new Column();
    expect(column.title).toEqual("");
    expect(column.items).toEqual([]);
});
