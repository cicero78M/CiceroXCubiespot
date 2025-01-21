import {  newRowsData } from "../database/new_query/sheet_query";

export async function instaContentBackup() {
    return new Promise(async (resolve, reject) => {
        try {
            clientData().then(
                async response =>{ 

                    for (let i = 0; i < response.length; i++){

                        newRowsData(
                            process.env.instaOfficialID, 
                            response[i].CLIENT_ID
                        ).then(
                            response =>{
                                console.log(response);
                            }
                        )
                        
                    }       
                }
            );

            resolve ("Success");
            
        } catch (error) {
            reject (error)            
        }
    });
}