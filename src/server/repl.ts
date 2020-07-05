import * as readline from "readline";
import * as process from "process";
import tokenize from "../parser/tokenizer";
import JSONManager from "../json/json_manager";
import Runner from "./runner";


async function run(tokens: string, runner: Runner): Promise<string> {
    const raw_result = await runner.run_from_string(tokens);

    return JSON.stringify(raw_result);
}

async function main(file_path: string) {
    const manager = new JSONManager(file_path);
    const runner = new Runner(manager);

    try {
        await runner.load();
    } catch (e) {
        console.error(e);
        process.exit(0);
    }

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let full_input = "";

    rl.prompt();
    rl.on("line", async (input) => {
        full_input += input;
        if (full_input === "exit;") {
            rl.close()
            return;
        };
        if (input.endsWith(";")) {
            try {
                let result = await run(full_input, runner);
                console.log(`Result: ${result}`)
                rl.setPrompt("> ");
                full_input = "";
            } catch (e) {
                console.error(`${e}`);
            }
            rl.setPrompt("> ");
            full_input = "";
        } else {
            rl.setPrompt("  ");
        }

        rl.prompt();
    });
}

let file_path = process.argv[2];
main(file_path);
