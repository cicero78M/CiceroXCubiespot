import { ciceroKey, newRowsData } from "../../app/database/new_query/sheet_query.js";
import { mkdirSync, writeFileSync  } from "fs";

export async function encryptClientData() {
    // let client = [];

    await newRowsData(
        ciceroKey.dbKey.clientDataID, 
        'ClientData_Enc'
    ).then(async data => {
            for (let i = 0; i < data.length; i++){

                let clientData = new Object();
                
                clientData.CLIENT_ID =  data[i].get("CLIENT_ID");
                clientData.TYPE =  data[i].get("TYPE");
                clientData.STATUS =  data[i].get("STATUS");
                clientData.INSTAGRAM =  data[i].get("INSTAGRAM");
                clientData.TIKTOK = data[i].get("TIKTOK");
                clientData.INSTA_STATE = data[i].get("INSTA_STATE");
                clientData.TIKTOK_STATE = data[i].get("TIKTOK_STATE");
                clientData.SUPERVISOR = data[i].get("SUPERVISOR");
                clientData.OPERATOR = data[i].get("OPERATOR");
                clientData.GROUP = data[i].get("GROUP");
                clientData.SECUID = data[i].get("SECUID");

                try {
                    writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${fromRows[0]}.json`, JSON.stringify(data));
                  } catch (error) {
                    mkdirSync(`json_data_file/insta_data/insta_likes/${clientName}`);
                    writeFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${fromRows[0]}.json`, JSON.stringify(data));
                  }  
            };
    });       // return "Client Data Encrypted"
}