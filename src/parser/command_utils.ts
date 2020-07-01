// Functions used in multiple commands

export type ColumnSearch = string[] | "All";
export function are_equal(arr1: string[], arr2: string[]): boolean {
    return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);
}

export function parse_columns(column_tokens: string[]): ColumnSearch {
    if (are_equal(column_tokens, ["*"])) return "All";
    else if (column_tokens.length === 1) return column_tokens;

    let comma_amount = column_tokens.filter(t => t === ",").length;

    if (comma_amount != (column_tokens.length - 1) / 2) {
        throw new Error("Missing commas");
    }
    return column_tokens.filter(t => t !== ",");
}

