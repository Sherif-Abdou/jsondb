import {SaveLoader} from "../json/json_manager";
import {readFile, writeFile} from "fs";
import Table from "../json/table";

export default class DefaultSaveLoader implements SaveLoader {
    load(file_path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            readFile(file_path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const str_data = data.toString();
                resolve(str_data);
            });
        });
    }

    save(file_path: string, tables: Table[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            writeFile(file_path, JSON.stringify(tables), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}