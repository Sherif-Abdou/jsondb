import tokenize from "./tokenizer";

test("Tokenizer parses a select command", () => {
    let sql_command = "select * from table1;";
    let tokens = tokenize(sql_command);
    expect(tokens).toEqual(["select", "*", "from", "table1", ";"]);
});

test("Tokenizer parses an insert into commmand", () => {
    let sql_command = "insert into table1 values (3, 2);";
    let tokens = tokenize(sql_command);
    expect(tokens).toEqual(["insert", "into", "table1", "values", "(", "3", ",", "2", ")", ";"]);
});
