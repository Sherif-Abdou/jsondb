import Table from "./table";
import { readFile, writeFile } from "fs";

export interface SaveLoader {
    load: (file_path: string) => Promise<string>
    save: (file_path: string, tables: Table[]) => Promise<void>
}

export default class JSONManager {
    file_path: string;
    tables: Table[];
    save_loader: SaveLoader;
    constructor(file_path: string, save_loader: SaveLoader = null) {
        this.file_path = file_path;
        this.tables = [];
        this.save_loader = save_loader;
    }

    async load() {
        const result = await this.save_loader.load(this.file_path);
        // return new Promise<void>((resolve, reject) => {
        //     readFile(this.file_path, (err, data) => {
        //         if (err) {
        //             reject(err);
        //             return;
        //         }
        //         const str_data = data.toString();
        //         this.tables = JSON.parse(str_data).map(v => Object.assign(new Table, v));
        //         resolve();
        //     });
        // });
        this.tables = JSON.parse(result).map(v => Object.assign(new Table, v));
    }

    async save() {
        await this.save_loader.save(this.file_path, this.tables);
        // return new Promise<void>((resolve, reject) => {
        //     writeFile(this.file_path, JSON.stringify(this.tables), (err) => {
        //         if (err) {
        //             reject(err);
        //             return;
        //         }
        //         resolve();
        //     });
        // });
    }
}
