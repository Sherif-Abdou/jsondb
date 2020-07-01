import JSONManager from "../json/json_manager";
import Table from "../json/table";
import Command, { CommandResult } from "../parser/command";

export default class Runner {
    private manager: JSONManager;
    constructor(manager: JSONManager, load: boolean = false) {
        this.manager = manager;
    }

    getTables(): Table[] {
        return this.manager.tables;
    }

    setTables(tables: Table[]): Promise<any> {
        this.manager.tables = tables;
        return this.manager.save();
    }

    async save(): Promise<any> {
        return this.manager.save();
    }

    async runCommand(command: Command): Promise<CommandResult> {
        let command_result = command.run();
        if (!command.mutates_state || command_result === [])
            return command_result;

        if (command_result[0] instanceof Table) {
            await this.setTables(command_result as Table[]);
            return "OK";
        }
    }
}
