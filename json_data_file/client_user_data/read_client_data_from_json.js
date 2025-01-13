import { readFileSync } from "fs";

export function clientData() {
    let data = JSON.parse(readFileSync('client_user_data/client_data.json'));
    console.log(data);
}