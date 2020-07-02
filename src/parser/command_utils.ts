// Functions used in multiple commands

import { ItemType } from "../json/item";

export type ColumnSearch = string[] | "All";
export function are_equal(arr1: string[], arr2: string[]): boolean {
    return (
        arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i])
    );
}

export function parse_columns(column_tokens: string[]): ColumnSearch {
    if (are_equal(column_tokens, ["*"])) return "All";
    else if (column_tokens.length === 1) return column_tokens;

    const comma_amount = column_tokens.filter((t) => t === ",").length;

    if (comma_amount != (column_tokens.length - 1) / 2) {
        throw new Error("Missing commas");
    }
    return column_tokens.filter((t) => t !== ",");
}

export function value_to_itemtype(value: string): ItemType {
    const parsed_number: number = parseFloat(value);
    if (!isNaN(parsed_number)) {
        return parsed_number;
    }
    if (value.startsWith("\"") && value.endsWith("\"")) {
        return value.substring(1, value.length - 1);
    }
    return value;
}
