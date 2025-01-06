import { client } from "../../../app.js";
import { ciceroKey } from "../new_query/sheet_query.js";
import { createClientID } from "./create_client_id.js";
import { createDataSheet } from "./create_data_sheet.js";
import { createSheetHeader } from "./create_header_rows.js";

export async function clientRegister(clientName, type) {
    
    let headerValues = ['SHORTCODE'];
    let headerValuesUser = [];
    let headerValuesInsta = [];
    let headerValuesTiktok = [];
    return new Promise(async (resolve, reject) => {
        createClientID(clientName, type).then(
            async data => {
                console.log(data);

                    //Create User Data
                    headerValuesUser = ['ID_KEY', 'NAMA', 'TITLE', 'DIVISI', 'JABATAN', 'STATUS', 'WHATSAPP', 'INSTA', 'TIKTOK', 'EXCEPTION'];

                    await createDataSheet(clientName, ciceroKey.dbKey.userDataID, headerValuesUser, "USER DATA").then(
                        async data =>{
                            console.log(data)
                            await client.sendMessage('6281235114745@c.us', data.data);
                                }).catch(
                                    data => reject (data));
                
                    //Create Insta Data
                    headerValuesInsta = ['TIMESTAMP', 'USER_ACCOUNT', 'SHORTCODE', 'ID', 'TYPE', 'CAPTION',
                        'COMMENT_COUNT', 'LIKE_COUNT', 'PLAY_COUNT'];

                    await createDataSheet(clientName, ciceroKey.dbKey.instaOfficialID, headerValuesInsta, "INSTA OFFICIAL").then(
                        async data =>{
                            console.log(data);
                            await client.sendMessage('6281235114745@c.us', data.data);
                            await createDataSheet(clientName, ciceroKey.dbKey.instaLikesUsernameID, headerValues, "INSTA USERNAME DATA").then(
                                async data =>{
                                     console.log(data);
                                     await client.sendMessage('6281235114745@c.us', data.data);
                                     await createSheetHeader(clientName, ciceroKey.dbKey.instaLikesUsernameID).then (
                                         async data =>{
                                             console.log(data);
                                             await client.sendMessage('6281235114745@c.us', data.data);
                                         }).catch(
                                            data => {reject (data);
                                                console.log(data)
                                            });
                                    }).catch(
                                        data => reject (data));

                                }).catch(
                                    data => reject (data));

                                    
                    //Create Tiktok Data
                    headerValuesTiktok = ['TIMESTAMP', 'USER_ACCOUNT', 'ID', 'COMMENT_COUNT',
                        'LIKE_COUNT', 'PLAY_COUNT', 'SHARE_COUNT', 'REPOST_COUNT'];
                    await createDataSheet(clientName, ciceroKey.dbKey.tiktokOfficialID, headerValuesTiktok, "TIKTOK OFFICIAL").then(
                        async data =>{
                            console.log(data);
                            await client.sendMessage('6281235114745@c.us', data.data);
                            await createDataSheet(clientName, ciceroKey.dbKey.tiktokCommentUsernameID, headerValues, "TIKTOK USERNAME DATA").then(
                                async data =>{
                                    console.log(data);
                                    await client.sendMessage('6281235114745@c.us', data.data);
                                    await createSheetHeader(clientName, ciceroKey.dbKey.tiktokCommentUsernameID).then (
                                        async data =>{
                                            console.log(data);
                                            await client.sendMessage('6281235114745@c.us', data.data);
                                        }).catch(
                                            data => reject (data));
                                }).catch(
                                    data => reject (data));
                        }).catch(
                            data => reject (data));

                    let response = {
                        data: `Success Created ${clientName} as Client`,
                        state: true,
                        code: 200
                    };
                    resolve (response);
                        }).catch(
                            data => reject (data));

        })
}


