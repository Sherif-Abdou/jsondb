import Item, { ItemType } from "../../json/item";
import Column from "../../json/column";
import { value_to_itemtype } from "../command_utils";

export enum ConditionType {
    Equal = "=",
    LessThan = "<",
    GreaterThan = ">",
    LessThanOrEqual = "<=",
    GreaterThanOrEqual = ">=",
    NotEqual = "!=",
};

export default class Where {
    private static condition_to_token = {
        "=": ConditionType.Equal,
        "<": ConditionType.LessThan,
        ">": ConditionType.GreaterThan,
        "<=": ConditionType.LessThanOrEqual,
        ">=": ConditionType.GreaterThanOrEqual
    }

    left_side: string;
    comparison: ConditionType;
    right_side: ItemType;


    static from_tokens(tokens: string[]): Where {
        console.error(`Where tokens: ${tokens}`)
        if (tokens[0].toLowerCase() !== "where") throw new Error("Missing where keyword");

        let where = new Where();

        if (tokens[1] === undefined) throw new Error("No condition after where token");
        where.left_side = tokens[1];
        if (tokens[2] === undefined) throw new Error("No comparison token");
        where.comparison = Where.condition_to_token[tokens[2]];
        if (tokens[3] === undefined) throw new Error("No value after comparison");
        where.right_side = value_to_itemtype(tokens[3]);

        return where;
    }

    to_rows(columns: Column[]): string[] {
        let column = columns.find(v => v.title === this.left_side);
        return column.items.filter(item => {
            switch (this.comparison) {
                case ConditionType.Equal:
                    return item.value == this.right_side;
                case ConditionType.GreaterThan:
                    return item.value > this.right_side;
                case ConditionType.LessThan:
                    return item.value < this.right_side;
                case ConditionType.GreaterThanOrEqual:
                    return item.value >= this.right_side;
                case ConditionType.LessThanOrEqual:
                    return item.value <= this.right_side;
                case ConditionType.NotEqual:
                    return item.value != this.right_side;
            }
        }).map(item => item.row_id);
    }
}