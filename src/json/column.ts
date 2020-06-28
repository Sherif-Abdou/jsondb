import {v4 as uuidv4} from "uuid";
import Item from "./item";

export default class Column {
    title: string;
    id: string;
    items: Item[];
    constructor() {
        this.title = "";
        this.id = uuidv4();
        this.items = [];
    }
}
