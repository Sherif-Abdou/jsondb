import JSONManager from "../json/json_manager"
import Column from "../json/column";
import Table from "../json/table";
import Item from "../json/item";

export type CommandResult = Column[] | Table[] | Item[] | "OK";

abstract class Command {
    manager: JSONManager;
    private tokens: string[];
    constructor(manager: JSONManager) {
        this.manager = manager;
        this.tokens = [];
    }

    abstract parse_tokens(tokens: string[]);
    abstract run(): CommandResult;
}

export default Command;
