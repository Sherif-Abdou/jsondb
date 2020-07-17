import Item, {ItemType} from "../../src/json/item";
import {v4 as uuidv4} from "uuid";

test("Item can initalize", () => {
    const row_id = uuidv4();
    const item = new Item(row_id);
    expect(item.row_id).toEqual(row_id);
    expect(item.value).toEqual(null);
});
