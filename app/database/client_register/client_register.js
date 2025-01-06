import { ciceroKey } from "../new_query/sheet_query";
import { createClientID } from "./create_client_id";
import { createDataSheet } from "./create_data_sheet";

export async function clientRegister(clientName, type) {

    let headerValues=[];
    return new Promise(async (resolve, reject) => {
        
        createClientID(clientName, type).then(
            data => {
                console.log(data);
                    headerValues = ['TIMESTAMP', 'USER_ACCOUNT', 'SHORTCODE', 'ID', 'TYPE', 'CAPTION',
                        'COMMENT_COUNT', 'LIKE_COUNT', 'PLAY_COUNT'];

                    createDataSheet(clientName, ciceroKey.dbKey.instaOfficialID, headerValues, "INSTA OFFICIAL").then(
                        data =>{
                            console.log(data)

                            createDataSheet(clientName, ciceroKey.dbKey.instaOfficialID, headerValues, "INSTA OFFICIAL").then(
                                data =>{
                                    console.log(data)
                                }).catch(
                                    data => reject (data));
                        }).catch(
                            data => reject (data));
            }
        ).catch(
            data => reject (data));

    });
}


