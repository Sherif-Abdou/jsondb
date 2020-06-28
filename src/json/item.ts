import {v4 as uuidv4} from "uuid";

export default class Item {
    value: ItemType 
    id: string
    row_id: string
    constructor(row_id: string) {
        this.value = null;
        this.id = uuidv4();
        this.row_id = row_id;
    }
}

export type ItemType = number | string | null | object | ItemType[];
