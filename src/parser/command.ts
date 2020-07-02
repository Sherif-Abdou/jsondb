import JSONManager from "../json/json_manager";
import Column from "../json/column";
import Table from "../json/table";
import Item from "../json/item";

export type CommandResult = Table[] | Column[] | Item[] | "OK";

abstract class Command {
    manager: JSONManager;
    private tokens: string[];
    abstract readonly mutates_state: boolean;
    constructor() {
        this.tokens = [];
    }

    abstract parse_tokens(tokens: string[]): void;
    abstract run(manager: JSONManager): CommandResult;
}

export default Command;
