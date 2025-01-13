import { readFileSync } from "fs";
import { decrypted } from "../crypto.js";

export async function clientData() {
    let data = [];
    data = JSON.parse(readFileSync('json_data_file/client_user_data/client_data.json'));
    console.log(data.length);
    // let client = [];

    for (let i = 0; i < data.length; i++){

        console.log(data[i]);

        let dataItems = data[i];

        let clientData = new Object();
                        
        clientData.CLIENT_ID = await decrypted(dataItems.CLIENT_ID);
        clientData.TYPE = await decrypted(dataItems.TYPE);
        clientData.STATUS = await decrypted(dataItems.STATUS);
        clientData.INSTAGRAM = await decrypted(dataItems.INSTAGRAM);
        clientData.TIKTOK = await decrypted(dataItems.TIKTOK);
        clientData.INSTA_STATE = await decrypted(dataItems.INSTA_STATE);
        clientData.TIKTOK_STATE = await decrypted(dataItems.TIKTOK_STATE);
        clientData.SUPERVISOR = await decrypted(dataItems.SUPERVISOR);
        clientData.OPERATOR = await decrypted(dataItems.OPERATOR);
        clientData.GROUP = await decrypted(dataItems.GROUP);
        clientData.SECUID = await decrypted(dataItems.SECUID);

        client.push(clientData);
        console.log(client);

    }

}