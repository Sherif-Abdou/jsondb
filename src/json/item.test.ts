import Item, {ItemType} from "./item";
import {v4 as uuidv4} from "uuid";

test("Item can initalize", () => {
    let row_id = uuidv4();
    let item = new Item(row_id);
    expect(item.row_id).toEqual(row_id);
    expect(item.value).toEqual(null);
});
