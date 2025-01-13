import { ciceroKey, newRowsData } from "../app/database/new_query/sheet_query.js";

const fs = require('fs');

fs.existsSync('myjsonfile.json',(exists) =>
    {
    if(exists){

        console.log("File Exists");

    }
});


let client = [];

export async function clientData2Json() {
    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData'
    ).then(async data => {
            for (let i = 0; i < data.length; i++){

                let clientData = new Object();
                clientData.CLIENT_ID = data[i].get("CLIENT_ID");
                clientData.TYPE = data[i].get("TYPE");
                clientData.STATUS = data[i].get("STATUS");
                clientData.INSTAGRAM = data[i].get("INSTAGRAM");
                clientData.TIKTOK = data[i].get("TIKTOK");
                clientData.INSTA_STATE = data[i].get("INSTA_STATE");
                clientData.TIKTOK_STATE = data[i].get("TIKTOK_STATE");
                clientData.SUPERVISOR = data[i].get("SUPERVISOR");
                clientData.OPERATOR = data[i].get("OPERATOR");
                clientData.GROUP = data[i].get("GROUP");
                clientData.SECUID = data[i].get("SECUID");

                client.push(clientData);
            //    console.log(client);                
            };
    });

    
}