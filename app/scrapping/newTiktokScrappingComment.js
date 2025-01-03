import { tiktokCommentAPI } from "../socialMediaAPI/tiktokAPI.js";

export async function getLikesTiktok(todayItems, cursorNumber) {

    console.log('Exec 1');

    let newDataUsers = [];    

    await tiktokCommentAPI(todayItems, cursorNumber).then (responseComments =>{


        console.log(responseComments);

            let commentItems = responseComments.data.comments;
            for (let ii = 0; ii < commentItems.length; ii++) {
                if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[i].user.unique_id != "") {
                    if (!newDataUsers.includes(commentItems[i].user.unique_id)) {
                        newDataUsers.push(commentItems[i].user.unique_id);
                    }
                }
            }

                console.log ('Time Skip');



            if (responseComments.data.has_more === 1){    

                console.log(responseComments.data.has_more );
                setTimeout(() => {
                    console.log('next data');
                    getLikesTiktok(todayItems, responseComments.data.cursor);

                }, 2000);

    
            } else {
    
                let data = {
                    code : 200,
                    status : true,
                    newDataUsers : newDataUsers
                }
                return data;
            }
    
    }). catch (response => {
        console.log(response);

        let data = {
            code : 204,
            status : false,
            newDataUsers : null

        }
        return data;    
    });

}