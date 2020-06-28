import Table from "./table";
import { readFile, writeFile } from "fs";

export default class JSONManager {
    file_path: string;
    tables: Table[];
    constructor(file_path: string) {
        this.file_path = file_path;
        this.tables = [];
    }

    load(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            readFile(this.file_path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                let str_data = data.toString();
                this.tables = JSON.parse(str_data);
                resolve();
            });
        });
    }

    save(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            writeFile(this.file_path, JSON.stringify(this.tables), err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
