import Column from "./column";

test("Column initializes", () => {
    const column = new Column();
    expect(column.title).toEqual("");
    expect(column.items).toEqual([]);
});
