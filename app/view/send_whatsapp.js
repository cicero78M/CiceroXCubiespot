import { client } from "../../app.js";
//Response By User
export async function sendResponse(from, responseData, errormessage) {
    
    switch (responseData.code){
        case 200:
            await client.sendMessage(from, responseData.data);
            break;
        case 201:
            await client.sendMessage(from, responseData.data);
            break;
        case 303:                                
            await client.sendMessage(from, errormessage);
            break;
        default:
            break;
    }   
}
//Response By Client
export async function sendClientResponse(clientID, supervisor, operator, group, responseData, type) {

    switch (responseData.code){
        case 200 :
            await client.sendMessage(supervisor, responseData.data);           
            await client.sendMessage(operator, responseData.data);
            await client.sendMessage(group, responseData.data);
            break;
        case 201:
            await client.sendMessage(supervisor, responseData.data);
            await client.sendMessage(operator, responseData.data);
            await client.sendMessage(group, responseData.data);
            break;
        case 303 :
            await client.sendMessage('6281235114745@c.us', clientID+' FAIL '+type+' DATA');
            break;           
        default:
            break;
    }
}