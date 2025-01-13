import { readFileSync } from "fs";

export function clientData() {
    let data = JSON.parse(readFileSync('json_data_file/client_user_data/client_data.json'));

    console.log(data);
}