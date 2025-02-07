import { mkdirSync, writeFileSync } from "fs";
import { decrypted } from "../../module/crypto.js";
import { newRowsData } from "../../module/sheet_query.js";


export async function restoreClientData() {
  
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});

    await newRowsData(
        process.env.clientDataID, 
        localDate
    ).then(async response => {

        let data = response.data;
        let client = [];

        for (let i = 0; i < data.length; i++){

          console.log(decrypted(data[i].get("TYPE")))

          console.log(process.env.APP_CLIENT_TYPE)

          if(decrypted(data[i].get("TYPE") === process.env.APP_CLIENT_TYPE)){

            console.log(data[i])

            try {

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
              // clientData.INSTA_2 = data[i].get("INSTA_2");
              // clientData.INSTA_2_STATE = data[i].get("INSTA_2_STATE");
  
              try {
                writeFileSync(`json_data_file/client_data/${decrypted(data[i].get("CLIENT_ID"))}.json`, JSON.stringify(clientData));

                console.leg("Success")
              } catch (error) {

                console.leg("Fail")

                mkdirSync(`json_data_file/client_data/${decrypted(data[i].get("CLIENT_ID"))}`);
                writeFileSync(`json_data_file/client_data/${decrypted(data[i].get("CLIENT_ID"))}.json`, JSON.stringify(clientData));
              } 
              
            } catch (error) {

              console.log(error);
            }
          }
        };
    });
}