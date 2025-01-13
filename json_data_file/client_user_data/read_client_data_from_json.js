import { readFileSync } from "fs";
import { decrypted } from "../crypto.js";

export async function clientData() {
    let data = [];
    data = JSON.parse(readFileSync('json_data_file/client_user_data/client_data.json'));
    console.log(data.length);
    // let client = [];

    for (let i = 0; i < data.length; i++){

        console.log(data[i]);

        // let dataItems = data[i];

        // let clientData = new Object();
                        
        // clientData.CLIENT_ID = await decrypted(dataItems[i].get("CLIENT_ID"));
        // clientData.TYPE = await decrypted(dataItems[i].get("TYPE"));
        // clientData.STATUS = await decrypted(dataItems[i].get("STATUS"));
        // clientData.INSTAGRAM = await decrypted(dataItems[i].get("INSTAGRAM"));
        // clientData.TIKTOK = await decrypted(dataItems[i].get("TIKTOK"));
        // clientData.INSTA_STATE = await decrypted(dataItems[i].get("INSTA_STATE"));
        // clientData.TIKTOK_STATE = await decrypted(dataItems[i].get("TIKTOK_STATE"));
        // clientData.SUPERVISOR = await decrypted(dataItems[i].get("SUPERVISOR"));
        // clientData.OPERATOR = await decrypted(dataItems[i].get("OPERATOR"));
        // clientData.GROUP = await decrypted(dataItems[i].get("GROUP"));
        // clientData.SECUID = await decrypted(dataItems[i].get("SECUID"));

        // client.push(clientData);


        // console.log(client);

    }

}