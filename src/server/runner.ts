import JSONManager from "../json/json_manager";
import Table from "../json/table";
import Command, { CommandResult } from "../parser/command";
import tokenize from "../parser/tokenizer";
import SelectCommand from "../parser/commands/select";
import InsertCommand from "../parser/commands/insert";
import UpdateCommand from "../parser/commands/update";
import DeleteCommand from "../parser/commands/delete";
import CreateTableCommand from "../parser/commands/create_table";
import DefaultSaveLoader from "./DefaultSaveLoader";

const token_to_command = {
    insert: InsertCommand,
    select: SelectCommand,
    update: UpdateCommand,
    delete: DeleteCommand,
    create: CreateTableCommand
}

export default class Runner {
    private manager: JSONManager;

    constructor(manager: JSONManager, load: boolean = false) {
        this.manager = manager;
        if (this.manager.save_loader === null) {
            this.manager.save_loader = new DefaultSaveLoader();
        }
    }

    getTables(): Table[] {
        return this.manager.tables;
    }

    setTables(tables: Table[]): Promise<void> {
        this.manager.tables = tables;
        return this.manager.save();
    }

    async save(): Promise<void> {
        return this.manager.save();
    }

    async load(): Promise<void> {
        return this.manager.load();
    }

    async runCommand(command: Command): Promise<CommandResult> {
        let command_result = command.run(this.manager);
        if (!command.mutates_state || command_result === []) {
            return command_result;
        }

        if (command_result[0] instanceof Table) {
            try {
                await this.setTables(command_result as Table[]);
            } catch (e) {
                throw e;
            }
            return "OK";
        }
    }

    async run_from_string(str: string): Promise<CommandResult> {
        const tokens = tokenize(str);
        if (tokens === undefined || tokens.length === 0) throw new Error("Couldn't tokenize string");
        const command_constructor = tokens[0].toLowerCase();
        if (command_constructor === undefined) throw new Error("Unrecognized command");

        let value: Command = new token_to_command[command_constructor]();
        value.parse_tokens(tokens);
        return this.runCommand(value);
    }
}
