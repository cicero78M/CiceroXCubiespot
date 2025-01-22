import { client } from "../../../app.js";
import { createClientID } from "./create_client_id.js";
import { createDataSheet } from "./create_data_sheet.js";
import { createSheetHeader } from "./create_header_rows.js";

export async function clientRegister(clientName, type) {
    
    let headerValues = ['SHORTCODE'];
    let headerValuesUser = [];
    let headerValuesInsta = [];
    let headerValuesTiktok = [];
    return new Promise(async (resolve, reject) => {
        createClientID(
            clientName, 
            type
        ).then(async data => {
            console.log(data);
                //Create User Data
            headerValuesUser = [
                'ID_KEY', 
                'NAMA', 
                'TITLE', 
                'DIVISI', 
                'JABATAN', 
                'STATUS', 
                'WHATSAPP', 
                'INSTA', 
                'TIKTOK', 
                'EXCEPTION'
            ];

            await createDataSheet(
                clientName, 
                process.env.userDataID, 
                headerValuesUser, 
                "USER DATA"
            ).then(
                async data =>{
                    console.log(data)
                    await client.sendMessage(
                        '6281235114745@c.us', 
                        data.data
                    );
            }).catch(
                data => reject (data)
            );
        
            //Create Insta Data
            headerValuesInsta = [
                'TIMESTAMP', 
                'USER_ACCOUNT', 
                'SHORTCODE', 
                'ID', 
                'TYPE', 
                'CAPTION',
                'COMMENT_COUNT', 
                'LIKE_COUNT', 
                'PLAY_COUNT'
            ];

            await createDataSheet(
                clientName, 
                process.env.instaOfficialID, 
                headerValuesInsta, 
                "INSTA OFFICIAL"
            ).then(
                async data =>{
                    console.log(data);
                    await client.sendMessage(
                        '6281235114745@c.us', 
                        data.data
                    );
                    
                    await createDataSheet(
                        clientName, 
                        process.env.instaLikesUsernameID, 
                        headerValues, 
                        "INSTA USERNAME DATA"
                    ).then(
                        async data =>{
                                console.log(data);
                                await client.sendMessage(
                                '6281235114745@c.us', 
                                data.data
                            );
                                await createSheetHeader(
                                clientName, 
                                process.env.instaLikesUsernameID
                            ).then (
                                    async data =>{
                                        console.log(data);
                                        await client.sendMessage(
                                        '6281235114745@c.us', 
                                        data.data
                                    );
                                }
                            ).catch(
                                data => {reject (data);
                                    console.log(data)
                                }
                            );
                        
                        }
                    ).catch(
                        data => reject (data)
                    );
                }
            ).catch(
                data => reject (data)
            );      
            
            //Create Tiktok Data
            headerValuesTiktok = [
                'TIMESTAMP', 
                'USER_ACCOUNT', 
                'ID', 
                'COMMENT_COUNT',
                'LIKE_COUNT', 
                'PLAY_COUNT', 
                'SHARE_COUNT', 
                'REPOST_COUNT'
            ];

            await createDataSheet(
                clientName, 
                process.env.tiktokOfficialID, 
                headerValuesTiktok, 
                "TIKTOK OFFICIAL"
            ).then(
                async data =>{
                    console.log(data);
                    await client.sendMessage(
                        '6281235114745@c.us', 
                        data.data
                    );
                    await createDataSheet(
                        clientName, 
                        process.env.tiktokCommentUsernameID, 
                        headerValues, 
                        "TIKTOK USERNAME DATA"
                    ).then(
                        async data =>{
                            console.log(data);
                            await client.sendMessage(
                                '6281235114745@c.us', 
                                data.data
                            );
                            await createSheetHeader(
                                clientName, 
                                process.env.tiktokCommentUsernameID
                            ).then (
                                async data =>{
                                    console.log(data);
                                    await client.sendMessage(
                                        '6281235114745@c.us', 
                                        data.data
                                    );
                                }
                            ).catch(
                                data => reject (data)
                            );
                        }
                    ).catch(
                        data => reject (data)
                    );
                }
            ).catch(
                data => reject (data)
            );

            let response = {
                data: `Success Created ${clientName} as Client`,
                state: true,
                code: 200
            };
            
            resolve (response);
        }).catch( data => {
            let response = {
                data: data,
                state: false,
                code: 303
            };
            
            reject (response);
        });

        }
    )
}