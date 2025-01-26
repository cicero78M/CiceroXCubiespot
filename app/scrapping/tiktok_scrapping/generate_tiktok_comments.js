import { logsSave, logsSend} from "../../responselogs/logs_modif.js";
import { tiktokCommentAPI } from "../../socialMediaAPI/tiktok_API.js";

export async function getTiktokComments(items) {

    logsSend('Execute Generate Tiktok Comments');

    let cursorNumber = 0;
    let switchPoint = 0;

    let newDataUsers = [];    
    
    newDataUsers.push(items);

    return new Promise((resolve) =>{
        
        forLoopGetComments(items, cursorNumber);

        async function forLoopGetComments(items, cursorNumber) {    

            let dataUser = 0;
            await tiktokCommentAPI(items, cursorNumber).then ( async response =>{

                const total = response.data.total+100;
                let commentItems = response.data.comments;
    
                for (let ii = 0; ii < commentItems.length; ii++) {
                    if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                        if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                            newDataUsers.push(commentItems[ii].user.unique_id);
                            dataUser++;
                        }
                    }
                }
    
                if (response.data.has_more === 1){    
                    setTimeout(async() => {
                        logsSave('next data normal '+response.data.cursor +" >>> "+total);
                        await forLoopGetComments(items, response.data.cursor);

                    }, 1100);

                } else {    
                    if(total === response.data.cursor){
                        if (switchPoint === 0){
                            switchPoint = 1;
                            setTimeout(async () => {
                                logsSave('next data switch point triggering '+response.data.cursor);
                                await forLoopGetComments(items, response.data.cursor);

                            }, 1100);

                        } else {
                            let data = {
                                data: newDataUsers,
                                state: true,
                                code: 200
                            };
                            resolve (data); 
                        }
                    } else {
                        if(total > 400){
                            if (dataUser != 0){
                                setTimeout(async () => {
                                    logsSave('next data not equals zero '+response.data.cursor+" >>> "+total);
                                    await forLoopGetComments(items, response.data.cursor);

                                }, 1100);

                            } else {
                                let data = {
                                    data: newDataUsers,
                                    state: true,
                                    code: 200
                                  };
                                resolve (data);                        
                            }
                        } else {
                            setTimeout(async () => {
                                logsSave('next data over 400 '+response.data.cursor+" >>>" +total);
                                await forLoopGetComments(items, response.data.cursor);

                            }, 1100); 
                   
                        }
                    }
                }
            }). catch (error => {
                logsSave(error);
                setTimeout(async () => {
                    logsSave('error'+cursorNumber);
                    await forLoopGetComments(items, cursorNumber);

                }, 2000); 

            });
        }
    });   
}