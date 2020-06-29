import tokenize from "./tokenizer";

test("Tokenizer", () => {
    let sql_command = "select * from table1;";
    console.log(tokenize(sql_command));
});
