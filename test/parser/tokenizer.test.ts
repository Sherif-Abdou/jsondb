import tokenize from "../../src/parser/tokenizer";

test("Tokenizer parses a select command", () => {
    const sql_command = "select * from table1;";
    const tokens = tokenize(sql_command);
    expect(tokens).toEqual(["select", "*", "from", "table1", ";"]);
});

test("Tokenizer parses an insert into commmand", () => {
    const sql_command = "insert into table1 values (3, 2);";
    const tokens = tokenize(sql_command);
    expect(tokens).toEqual(["insert", "into", "table1", "values", "(", "3", ",", "2", ")", ";"]);
});
