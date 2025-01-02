import { client } from "../../app.js";
//Date Time
const d = new Date();
const localDate = d.toLocaleDateString("en-US", {
    timeZone: "Asia/Jakarta"
});
const hours = d.toLocaleTimeString("en-US", {
    timeZone: "Asia/Jakarta"
});     
const time = localDate+" >> "+hours;

//Response By User
export function sendResponse(from, responseData, errormessage) {
    switch (responseData.code){
        case 200:
            console.log(time+" SUCCESS GENERATE DATA");
            client.sendMessage(from, responseData.data);
            break;
        case 303:                                
            console.log(responseData.data);
            client.sendMessage(from, errormessage);
            break;
        default:
            console.log(time+" "+responseData.data);
            client.sendMessage(from, responseData.data);
            break;
    }   
}
//Response By Client
export function sendClientResponse(clientID, supervisor, operator, group, responseData, type) {
    switch (responseData.code){
        case 200 :
            console.log(time+" "+clientID+' SUCCESS '+type+' DATA');
            client.sendMessage(supervisor, responseData.data);
            client.sendMessage(operator, responseData.data);
            client.sendMessage(group, responseData.data);
            break;
        case 303 :
            console.log(time+" "+clientID+' FAIL '+type+' DATA');
            client.sendMessage('6281235114745@c.us', responseData.data);
            break;
        default:
            console.log(time+" "+responseData.data);
            client.sendMessage(supervisor, responseData.data);
            client.sendMessage(operator, responseData.data);
            client.sendMessage(group, responseData.data);
            break;
    }
}