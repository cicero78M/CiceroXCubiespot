import express from 'express';
const app = express();

import { readFileSync } from 'fs';
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;

import qrcode from 'qrcode-terminal';

import figlet from 'figlet';
const { textSync } = figlet;

import { set } from 'simple-banner';
import { schedule } from 'node-cron';

import { saveContacts } from './app/database/saveContact.js';
import { myData } from './app/database_query/myData.js';
import { infoView } from './app/view/infoView.js';
import { propertiesView } from './app/view/propertiesView.js';
import { collectInstaLikes } from './app/scrapping/collectInstaLikes.js';
import { reportInstaLikes } from './app/reporting/reportInstaLikes.js';
import { collectTiktokComments } from './app/scrapping/collectTiktokEngagements.js';
import { reportTiktokComments } from './app/reporting/reportTiktokComments.js';
import { usernameAbsensi } from './app/database_query/usernameAbsensi.js';
import { sheetDoc } from './app/database_query/sheetDoc.js';
import { pushUserClient } from './app/database/pushUserClient.js';
import { addNewUser } from './app/database/addNewUser.js';
import { updateUsername } from './app/database/updateUsername.js';
import { collectInstaUser } from './app/scrapping/collectInstaUser.js';
import { setSecuid } from './app/database/secuidTiktok.js';
import { sendClientResponse, sendResponse } from './app/view/sendWA.js';
import { editProfile } from './app/database/editUserProfile.js';

//Routing Port 
const port = ciceroKey.port;

//Express Routing
app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

//WWEB JS Client Constructor
export const client = new Client({
    authStrategy: new LocalAuth({
        clientId: ciceroKey.waSession,
    }),

});


//WWEB Client Initializing
console.log('Initializing...');
client.initialize();
//WWeB Authenticate Checking
client.on('authenthicated', (session)=>{
    console.log(+JSON.stringify(session));
});
//WWEB If Authenticate Failure
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});
//WWEB If Disconected
client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
//WWeb Ready
client.on('ready', () => {
    //Banner
    console.log(textSync("CICERO -X- CUBIESPOT", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    set("Cicero System Manajemen As A Services");
    console.log('===============================');
    console.log('===============================');
    console.log('======System Fully Loaded!=====');
    console.log('=========Enjoy the Ride========');
    console.log('===We\'ll Take Care Everything==');
    console.log('===============================');
    console.log('===============================');

    //Server Life Send Msg
    schedule('*/10 * * * *', async () =>  {
                //Date Time
        const d = new Date();
        const localDate = d.toLocaleDateString("en-US", {
            timeZone: "Asia/Jakarta"
        });
        const hours = d.toLocaleTimeString("en-US", {
            timeZone: "Asia/Jakarta"
        });     
        const time = localDate+" >> "+hours;

        console.log(time+' '+ciceroKey.waSession+' <<<System Alive>>>');
        client.sendMessage('6281235114745@c.us', ciceroKey.waSession+' <<<System Alive>>>');
    });

    // Reload Tiktok every hours until 22
    schedule('40 6-21 * * *', async () => {
            //Date Time
            const d = new Date();
            const localDate = d.toLocaleDateString("en-US", {
                timeZone: "Asia/Jakarta"
            });
            const hours = d.toLocaleTimeString("en-US", {
                timeZone: "Asia/Jakarta"
            });     
            const time = localDate+" >> "+hours;
        try {
            //Commit if schedule Working
            await client.sendMessage('6281235114745@c.us', 'Generate All Socmed Data Starting...');            
            console.log(time+' Generate All Socmed Data Starting');
            const clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
            const clientRows = await clientResponse.data;
            //Iterate Data By Client 
            for (let i = 0; i < clientRows.length; i++){
                //Checking Client properties
                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                    //Logs
                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                    //Call Scrapping Tiktok Comment by Client Data
                    let loadTiktok = await collectTiktokComments(clientRows[i]);
                    //Response Processing 
                    let reportTiktok;
                    switch (loadTiktok.code) {
                        case 200:
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD TIKTOK DATA');
                            reportTiktok = await reportTiktokComments(clientRows[i]);
                            sendResponse('6281235114745@c.us', reportTiktok, clientRows[i].get('CLIENT_ID')+' ERROR LOAD TIKTOK DATA');
                            break;                                           
                        case 303:
                            console.log(loadTiktok.data);
                            break;
                        default:
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' TRY REPORT TIKTOK DATA');
                            reportTiktok = await reportTiktokComments(clientRows[i]);
                            sendResponse('6281235114745@c.us', reportTiktok, clientRows[i].get('CLIENT_ID')+' ERROR LOAD TIKTOK DATA');
                            break;                        
                    }
                }
                //Checking Client properties                
                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                    //Call Scrapping Insta Likes by Client Data
                    let loadInsta = await collectInstaLikes(clientRows[i]);
                    //Proccessing Data
                    let reportInsta;
                    switch (loadInsta.code) {
                        case 200:
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                            reportInsta = await reportInstaLikes(clientRows[i]);
                            sendResponse('6281235114745@c.us', reportInsta, clientRows[i].get('CLIENT_ID')+' ERROR LOAD INSTA DATA');
                            break;                                           
                        case 303:
                            console.log(loadInsta.data);
                            break;
                        default:
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                            reportInsta = await reportInstaLikes(clientRows[i]);
                            sendResponse('6281235114745@c.us', reportInsta, clientRows[i].get('CLIENT_ID')+' ERROR LOAD INSTA DATA');
                            break;
                    }
                } 
            }
        //If Something Error
        } catch (error) {
            console.log(error)
            await client.sendMessage('6281235114745@c.us', 'Cron Job Hourly Error ');
        }
    });

    // Reload Tiktok every hours until 15/18/21
    schedule('00 15,18,21 * * *', async () => {
        //Date Time
        const d = new Date();
        const localDate = d.toLocaleDateString("en-US", {
            timeZone: "Asia/Jakarta"
        });
        const hours = d.toLocaleTimeString("en-US", {
            timeZone: "Asia/Jakarta"
        });     
        const time = localDate+" >> "+hours;
        try {
            client.sendMessage('6281235114745@c.us', 'Cron Job Starting...');            
            console.log(time+' Cron Job Starting');
            const clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
            const clientRows = clientResponse.data;

            //Itterate Client Data
            for (let i = 0; i < clientRows.length; i++){
            
                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                    let loadTiktok = await collectTiktokComments(clientRows[i]);
                    //Proccessing Data            
                    let reportTiktok;
                    switch (loadTiktok.code) {
                        case 200:                       
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD TIKTOK DATA');
                            reportTiktok = await reportTiktokComments(clientRows[i]);
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),
                                reportTiktok, ' REPORT TIKTOK');    
                            break;   
                        case 303:
                            console.log(loadTiktok.data);
                            break;                     
                        default:
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' TRY REPORT TIKTOK DATA');
                            reportTiktok = await reportTiktokComments(clientRows[i]);
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),
                                reportTiktok, ' REPORT TIKTOK');
                            break;
                    }
                }
                
                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                    client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                    //Scrapping Insta Data
                    let loadInsta = await collectInstaLikes(clientRows[i]);
                    //Processing Data
                    let reportInsta;
                    switch (loadInsta.code) {
                        case 200:
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                            client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                            reportInsta = await reportInstaLikes(clientRows[i]);
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),
                                reportInsta, ' REPORT INSTA');
                            break;     
                        case 303:
                            console.log(loadInsta.data);
                            break;                      
                        default:
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' FAIL LOAD REPORT DATA');
                            reportInsta = await reportInstaLikes(clientRows[i]);
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),
                                reportInsta, ' REPORT INSTA');
                            break;
                    }
                } 
            }
        //If Something Error            
        } catch (error) {
            console.log(error)
            await client.sendMessage('6281235114745@c.us', 'Cron Job Client Report Error');
        }
    });
});

client.on('qr', qr => {
    //Pairing WA Center
    qrcode.generate(qr, {small: true});
});

let rejectCalls = true;
client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
});

client.on('message', async (msg) => {
    //Date Time
    const d = new Date();
    const localDate = d.toLocaleDateString("en-US", {
        timeZone: "Asia/Jakarta"
    });
    const hours = d.toLocaleTimeString("en-US", {
        timeZone: "Asia/Jakarta"
    });     
    const time = localDate+" >> "+hours;
    const adminOrder =['pushuserres', 'pushusercom','clientstate', 'allsocmed', 'alltiktok', 'allinsta','reporttiktok', 'reportinsta','exception', 'savecontact','secuid'];
    const operatorOrder = ['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
    const userOrder =['mydata', 'updateinsta', 'updatetiktok','editnama','nama', 'editdivisi', 'editjabatan',  'pangkat', 'title','tiktok', 'jabatan', 
        'ig','ig1', 'ig2','ig3', 'insta'];
    const info = ['info', 'divisilist', 'titlelist'];
    const cubies = ['follow', 'like', 'comment'];
    try {
        const contact = await msg.getContact();
        if (msg.isStatus){
            
            //If Msg is WA Story
            const chat = await msg.getChat();
            chat.sendSeen();
            if (contact.pushname !== undefined){

                console.log(contact.pushname+" ===>>>> "+msg.body);
                let body = msg.body;
                let url = body.match(/\bhttps?:\/\/\S+/gi);

                if (url != null || url != undefined){
                    let splittedUrl = url[0].split('/');
                    if (splittedUrl.includes("www.instagram.com")){
                    console.log('Response Sent');
                    //client.sendMessage(msg.author, 'Terimakasih sudah berpartisipasi melakukan share konten :\n\n'+url[0]+'\n\nSelalu Semangat ya.');
                        
                    //   let rawLink;
                    /*  
                    if(url[0].includes('/?')){
                        rawLink = url[0].replaceAll('/?', '?');
                        shortcode = rawLink.split('?')[0].split('/').pop();
                    } else {
                        shortcode = url[0].split('/').pop();
                    }

                    //Report Likes from Insta Official
                    let response = await _instaSW(contact.number, shortcode);
                
                    if (response.code === 200){
                        client.sendMessage(msg.from, response.data);
                    } else {
                        console.log(response.data);
                    }
                    */ 
                  }
                }            
            }

        } else {
            //Splitted Msg
            const splittedMsg = msg.body.split("#");
            if (splittedMsg.length > 1){
                let chatMsg = await msg.getChat();
                chatMsg.sendSeen();
                chatMsg.sendStateTyping();
                console.log(msg.from+' ==> '+splittedMsg[1].toLowerCase());
                //Admin Order Data         
                if (adminOrder.includes(splittedMsg[1].toLowerCase())){//adminOrder =['pushuserres', 'pushusercom','clientstate', 'reloadinstalikes', 'reloadtiktokcomments', 
                    //'reloadstorysharing', 'reloadallinsta', 'reloadalltiktok', 'reportinstalikes', 'reporttiktokcomments', 'reportwastory'];
                    //ClientName#pushnewuserres#linkspreadsheet
                    if (splittedMsg[1].toLowerCase() === 'pushuserres'){
                        //Res Request
                        console.log('Push User Res Client Triggered');

                        if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){

                            console.log("Link True");
                        
                            console.log(splittedMsg[1].toUpperCase()+" Triggered");

                            let responseData = await pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "RES");
                            
                            if (responseData.code === 200){
                                console.log(responseData.data);
                                client.sendMessage(msg.from, responseData.data);
                            } else {
                                console.log(responseData.data);
                            }                          
                        }  else {
                            console.log('Bukan Spreadsheet Links');
                            client.sendMessage(msg.from, 'Bukan Spreadsheet Links');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'pushusercom'){
                        //Company Request     
                        //ClientName#pushnewusercom#linkspreadsheet
                        
                        console.log('Push User Com Client Triggered');

                        if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){

                            console.log("Link True");
                            
                            console.log(splittedMsg[1].toUpperCase()+" Triggered");

                            let responseData = await pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "COM");
                            
                            if (responseData.code === 200){
                                console.log(responseData.data);
                                client.sendMessage(msg.from, responseData.data);
                            } else {
                                console.log(responseData.data);
                            }                          
                        } else {
                    
                            console.log('Bukan Spreadsheet Links');
                            client.sendMessage(msg.from, 'Bukan Spreadsheet Links');
    
                        }
                        
                    } else if (splittedMsg[1].toLowerCase() === 'allsocmed') {
                        try {
                            //Generate All Socmed
                            await client.sendMessage('6281235114745@c.us', 'Generate All Socmed Data Starting...');
                            console.log(time+' Generate All Socmed Data Starting');
                            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let clientRows = await clientResponse.data;
                            //Itterate Client
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                                    //Scrapping TIKTOK by Client
                                    let loadTiktok = await collectTiktokComments(clientRows[i]);
                                    //Wait A Second
                                    setTimeout(() => {
                                        console.log("Collecting Tiktok Data");
                                    }, 1000);
                                    //Proccessing Data
                                    let reportTiktok;
                                    switch (loadTiktok.code) {
                                        case 200:
                                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD TIKTOK DATA');            
                                            reportTiktok = await reportTiktokComments(clientRows[i]);
                                            sendResponse(msg.from, reportTiktok, clientRows[i].get('CLIENT_ID')+' ERROR LOAD TIKTOK DATA');
                                            break;                                           
                                        case 303:
                                            console.log(loadTiktok.data);
                                            break;
                                        default:
                                            reportTiktok = await reportTiktokComments(clientRows[i]);
                                            sendResponse(msg.from, reportTiktok, clientRows[i].get('CLIENT_ID')+' ERROR LOAD TIKTOK DATA');
                                            break;
                                    }
                                }           
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                    //Scrapping Insta by Client
                                    let loadInsta = await collectInstaLikes(clientRows[i]);
                                    //Proccessing Data
                                    let reportInsta;
                                    switch (loadInsta.code) {
                                        case 200:
                                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                                            reportInsta = await reportInstaLikes(clientRows[i]);
                                            setTimeout(() => {
                                                console.log("Collecting Report Data");
                                            }, 1000);
                                            sendResponse(msg.from, reportInsta, clientRows[i]+' ERROR LOAD INSTA DATA');
                                            break;                                           
                                        case 303:
                                            console.log(loadInsta.data);
                                            break;
                                        default:
                                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                                            reportInsta = await reportInstaLikes(clientRows[i]);
                                            setTimeout(() => {
                                                console.log("Collecting Report Data");
                                            }, 1000);
                                            sendResponse(msg.from, reportInsta, clientRows[i].get('CLIENT_ID')+' ERROR LOAD INSTA DATA');
                                            break;
                                    }
                                } 
                            }
                        //if Something error
                        } catch (error) {
                            console.log(error)
                            await client.sendMessage('6281235114745@c.us', 'Collect #ALLSOCMED Error');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'allinsta') {
                        try {
                            //Generate All Socmed
                            await client.sendMessage('6281235114745@c.us', 'Generate All Insta Data Starting...');
                            console.log(time+' Generate All Insta Data Starting');
                            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let clientRows = await clientResponse.data;
                            //Itterate Client
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                    //Scrapping Insta by Client
                                    let loadInsta = await collectInstaLikes(clientRows[i]);
                                    //Proccessing Data
                                    let reportInsta;
                                    switch (loadInsta.code) {
                                        case 200:
                                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                                            reportInsta = await reportInstaLikes(clientRows[i]);
                                            sendResponse(msg.from, reportInsta, clientRows[i].get('CLIENT_ID')+' ERROR LOAD INSTA DATA');
                                            break;                                           
                                        case 303:
                                            console.log(loadInsta.data);
                                            break;
                                        default:
                                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                                            reportInsta = await reportInstaLikes(clientRows[i]);
                                            sendResponse(msg.from, reportInsta, clientRows[i].get('CLIENT_ID')+' ERROR LOAD INSTA DATA');
                                            break;
                                    }
                                } 
                            }
                        //if Something error
                        } catch (error) {
                            console.log(error)
                            await client.sendMessage('6281235114745@c.us', 'Collect #ALLINSTA Error');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'alltiktok') {
                        try {
                            //Generate All Socmed
                            await client.sendMessage('6281235114745@c.us', 'Generate All Tiktok Data Starting...');
                            console.log(time+' Generate All Tiktok Data Starting');
                            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let clientRows = await clientResponse.data;
                            //Itterate Client
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                                    //Scrapping TIKTOK by Client
                                    let loadTiktok = await collectTiktokComments(clientRows[i]);
                                    //Proccessing Data
                                    let reportTiktok;
                                    switch (loadTiktok.code) {
                                        case 200:
                                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD TIKTOK DATA');
                                            reportTiktok = await reportTiktokComments(clientRows[i]);
                                            sendResponse(msg.from, reportTiktok, clientRows[i].get('CLIENT_ID')+' ERROR LOAD TIKTOK DATA');
                                            break;                                           
                                        case 303:
                                            console.log(loadTiktok.data);
                                            break;
                                        default:
                                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' TRY REPORT TIKTOK DATA');
                                            reportTiktok = await reportTiktokComments(clientRows[i]);
                                            sendResponse(msg.from, reportTiktok, clientRows[i].get('CLIENT_ID')+' ERROR LOAD TIKTOK DATA');
                                            break;
                                    }
                                }           
                            }
                        //if Something error
                        } catch (error) {
                            console.log(error)
                            await client.sendMessage('6281235114745@c.us', 'Collect #ALLTIKTOK Error');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'reporttiktok') {
                        try {
                            //Generate All Socmed
                            await client.sendMessage('6281235114745@c.us', 'Generate Report Tiktok Data Starting...');
                            console.log(time+' Generate Report Tiktok Data Starting');
                            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let clientRows = await clientResponse.data;
                            //Itterate Client
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START REPORT TIKTOK DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START REPORT TIKTOK DATA');
                                    //Scrapping TIKTOK by Client
                                    let reportTiktok = await reportTiktokComments(clientRows[i]);
                                    sendResponse(msg.from, reportTiktok, clientRows[i].get('CLIENT_ID')+' ERROR LOAD TIKTOK DATA');
                                }           
                            }
                        //if Something error
                        } catch (error) {
                            console.log(error)
                            await client.sendMessage('6281235114745@c.us', 'Collect #REPORTTIKTOK Error');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'reportinsta') {
                        try {
                            //Generate All Socmed
                            await client.sendMessage('6281235114745@c.us', 'Generate Report Insta Data Starting...');
                            console.log(time+' Generate Report Insta Data Starting');
                            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let clientRows = await clientResponse.data;
                            //Itterate Client
                            for (let i = 0; i < clientRows.length; i++){

                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                                    let reportInsta = await reportInstaLikes(clientRows[i]);
                                    sendResponse(msg.from, reportInsta, clientRows[i].get('CLIENT_ID')+' ERROR LOAD INSTA DATA');
                                } 
                            }
                        } catch (error) {
                            console.log(error)
                            await client.sendMessage('6281235114745@c.us', 'Collect #REPORTINSTA Error');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'secuid') {
                        try {
                            //Generate All Socmed
                            await client.sendMessage('6281235114745@c.us', 'Generate Tiktok secUID Data Starting...');
                            console.log(time+' Generate Tiktok secUID Data Starting');
                            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let clientRows = await clientResponse.data;
                            //Itterate Client
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                    console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START TIKTOK SECUID DATA');
                                    await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START TIKTOK SECUID DATA');
                                    let tiktokSecuid = await setSecuid(clientRows[i]);
                                    sendResponse(msg.from, tiktokSecuid, clientRows[i].get('CLIENT_ID')+' ERROR TIKTOK SECUID DATA');
                                } 
                            }
                        } catch (error) {
                            console.log(error)
                            await client.sendMessage('6281235114745@c.us', 'Collect #SECUIDERROR Error');
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'createClientData'){

                        let response = await createClient(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase());

                        for (let i = 0; i < response.length; i++){

                            console.log(response[i].data);
                            client.sendMessage(msg.from, response[i].data);

                        }                   
                    } else if (splittedMsg[1].toLowerCase() === 'exception') {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), 
                            "EXCEPTION");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', 'Response Error from Exceptions');
                        }   
                    } else if (splittedMsg[1].toLowerCase() === 'savecontact') {
                        let response = await saveContacts();
                        console.log(response);
                    }                   
                //Operator Order Data         
                } else if (operatorOrder.includes(splittedMsg[1].toLowerCase())){//['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
                    let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                    let clientRows = clientResponse.data;
                    for (let i = 0; i < clientRows.length; i++){
                        if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                            let responseData;
                            switch (splittedMsg[1].toLowerCase()) {
                                case "addnewuser":
                                    //clientName#addnewuser#id_key/NRP#name#divisi/satfung#jabatan#pangkat/title
                                    responseData = await addNewUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                                    splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase());
                                    setTimeout(() => {
                                        console.log("Collecting User Data");
                                    }, 1000);
                                    sendResponse(msg.from, responseData, "Error Adding New User");
                                    break;
                                case "deleteuser":
                                    //clientName#deleteuser#id_key/NRP#newdata
                                    responseData = await editProfile(splittedMsg[0].toUpperCase(), splittedMsg[2].toLowerCase(), false, msg.from.replace('@c.us', ''), "STATUS");
                                    setTimeout(() => {
                                        console.log("Collecting User Data");
                                    }, 1000);
                                    sendResponse(msg.from, responseData, "Error Delete User Data");
                                    break;
                                case "instacheck":
                                    //ClientName#instacheck
                                    responseData = await usernameAbsensi(splittedMsg[0].toUpperCase(), 'INSTA');
                                    setTimeout(() => {
                                        console.log("Collecting User Data");
                                    }, 1000);                                       
                                    sendResponse(msg.from, responseData, "Error on Insta Check Data");
                                    break;
                                case "tiktokcheck":
                                    //ClientName#tiktokcheck
                                    responseData = await usernameAbsensi(splittedMsg[0].toUpperCase(), 'TIKTOK');  
                                    setTimeout(() => {
                                        console.log("Collecting User Data");
                                    }, 1000);  
                                    sendResponse(msg.from, responseData, "Error on Tiktok Check Data");
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                //User Order Data         
                } else if (userOrder.includes(splittedMsg[1].toLowerCase())){//const userOrder =['menu', 'mydata','editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok', 'ig', 'tiktok', 'jabatan']
                    let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                    let clientRows = clientResponse.data;
                    //Wait A Second
                    setTimeout(() => {
                        console.log("Collecting Client Data");
                    }, 1000);
                    for (let i = 0; i < clientRows.length; i++){
                        if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                            if (['updateinsta', 'ig', 'ig1', 'ig2','ig3', 'insta'].includes(splittedMsg[1].toLowerCase())) {
                                //Update Insta Profile
                                //CLientName#updateinsta/ig/#linkprofileinstagram
                                if (splittedMsg[3].includes('instagram.com')){
                                    if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
                                        const instaLink = splittedMsg[3].split('?')[0];
                                        const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  
                                        let responseData = await updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], instaUsername, contact.number, "updateinstausername");
                                        setTimeout(() => {
                                            console.log("Collecting User Data");
                                        }, 1000);
                                        sendResponse(msg.from, responseData, "Error Update Insta");
                                    } else {
                                        console.log('Bukan Link Profile Instagram');
                                        client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                                    }
                                } else {
                                    console.log('Bukan Link Instagram');
                                    client.sendMessage(msg.from, 'Bukan Link Instagram');
                                }
                            } else if (['updatetiktok', 'tiktok'].includes(splittedMsg[1].toLowerCase())) {
                                //Update Tiktok profile
                                //CLientName#updatetiktok/tiktok/#linkprofiletiktok
                                if (splittedMsg[3].includes('tiktok.com')){
                                    const tiktokLink = splittedMsg[3].split('?')[0];
                                    const tiktokUsername = tiktokLink.split('/').pop();  
                                    let responseData = await updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], tiktokUsername, contact.number, "updatetiktokusername");
                                    setTimeout(() => {
                                        console.log("Collecting User Data");
                                    }, 1000);
                                    sendResponse(msg.from, responseData, "Error Update Tiktok");
                                } else {
                                    console.log('Bukan Link Profile Tiktok');
                                    client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                                }      
                            } else if (['editdivisi', 'satfung' ].includes(splittedMsg[1].toLowerCase())) {
                                //update Divisi Name
                                //clientName#editdivisi/satfung#id_key/NRP#newdata
                                let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                    msg.from.replace('@c.us', ''), "DIVISI");
                                setTimeout(() => {
                                    console.log("Collecting User Data");
                                }, 1000);
                                sendResponse(msg.from, responseData, "Error Edit Satfung");
                            } else if (['editjabatan', 'jabatan'].includes(splittedMsg[1].toLowerCase())) {
                                //Update Jabatan
                                //clientName#editjabatan/jabatan#id_key/NRP#newdata
                                let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                    msg.from.replace('@c.us', ''), "JABATAN");
                                setTimeout(() => {
                                    console.log("Collecting User Data");
                                }, 1000);
                                sendResponse(msg.from, responseData, "Error Edit Jabatan");
                            } else if (['editnama', 'nama'].includes(splittedMsg[1].toLowerCase())) {
                                //clientName#editnama/nama#id_key/NRP#newdata
                                let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                    msg.from.replace('@c.us', ''), "NAMA");
                                setTimeout(() => {
                                    console.log("Collecting User Data");
                                }, 1000);
                                sendResponse(msg.from, responseData, "Error Edit Nama");
                            } else if (['editpangkat', 'ubahpangkat', 'pangkat', 'title'].includes(splittedMsg[1].toLowerCase())) {
                                //clientName#editnama/nama#id_key/NRP#newdata
                                let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), 
                                    msg.from.replace('@c.us', ''), "PANGKAT");
                                setTimeout(() => {
                                    console.log("Collecting User Data");
                                }, 1000);
                                sendResponse(msg.from, responseData, "Error Edit Pangkat");
                            } else if (splittedMsg[1].toLowerCase() === 'mydata') {
                                let responseData = await myData(splittedMsg[0].toUpperCase(), splittedMsg[2]);
                                sendResponse(msg.from, responseData, "Error on Getting My Data");
                            }
                        }
                    }
                } else if (info.includes(splittedMsg[1].toLowerCase())){//    const info = ['menu', 'divisilist', 'titlelist'];
                    let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                    let clientRows = clientResponse.data;
                    //Wait A Second
                    setTimeout(() => {
                        console.log("Collecting Client Data");
                    }, 1000);
                    for (let i = 0; i < clientRows.length; i++){
                        if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                            let responseData;
                            switch (splittedMsg[1].toLowerCase()) {
                                case 'info':
                                    responseData = await infoView(splittedMsg[0].toUpperCase());
                                    setTimeout(() => {
                                        console.log("Collecting Client Data");
                                    }, 1000);
                                    client.sendMessage(msg.from, responseData.data);
                                    break;
                                case 'divisilist':                        
                                    responseData = await propertiesView(splittedMsg[0].toUpperCase(), "DIVISI");
                                    setTimeout(() => {
                                        console.log("Collecting User Data");
                                    }, 1000);
                                    client.sendMessage(msg.from, responseData.data);  
                                    break;
                                case 'titlelist':    
                                    responseData = await propertiesView(splittedMsg[0].toUpperCase(), "TITLE");
                                    setTimeout(() => {
                                        console.log("Collecting User Data");
                                    }, 1000);
                                    client.sendMessage(msg.from, responseData.data); 
                                    break;                   
                                default:
                                    break;
                            }
                        }
                    }

                } else if (cubies.includes(splittedMsg[0].toLowerCase())){//    const cubies = ['follow', 'like', 'comment'];
                    switch (splittedMsg[0].toLowerCase()) {
                        case 'follow':

                            if(splittedMsg[1].toLowerCase().includes('https://www.instagram.com/')){

                                if (!splittedMsg[1].includes('/p/') || !splittedMsg[1].includes('/reels/') || !splittedMsg[1].includes('/video/') ){

                                    const instaLink = splittedMsg[1].split('?')[0];
                                    const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  

                                    collectInstaUser(msg.from, instaUsername).then(async (responseData) => {
                                        console.log(responseData);                                    });
                                } else {
                                    client.sendMessage(msg.from, "Silahkan Cek Kembali, link yang anda cantumkan, pastikan link tersebut adalah link Akun Profile " 
                                        +"Instagram anda dan bukan Akun Private.\n\nTerimakasih.");
                                }

                            } else{
                                client.sendMessage(msg.from, "Silahkan Cek Kembali link yang anda cantumkan, pastikan link tersebut adalah link Akun Profile " 
                                    +"Instagram anda dan bukan Akun Private.\n\nTerimakasih.");
                            }
                            break;
                        case 'like':
                            break;
                        case 'comment':
                            break;
                        default:
                            break;                    
                    }

                //Key Order Data Not Exist         
                } else {
                    let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                    let clientRows = clientResponse.data;
                    //Wait A Second
                    setTimeout(() => {
                        console.log("Collecting Client Data");
                    }, 1000);
                    for (let i = 0; i < clientRows.length; i++){
                        if(clientRows[i].get("CLIENT_ID") === splittedMsg[0].toUpperCase()){
                            console.log("Request Code Doesn't Exist");
                            let responseData = await infoView(splittedMsg[0].toUpperCase());
                            //Wait A Second
                            setTimeout(() => {
                                console.log("Collecting User Data");
                            }, 1000);
                            client.sendMessage(msg.from, responseData.data);
                        }
                    }
                }
                //if(splittedMsg[1].toLowerCase()......
            } else {
                const contact = await msg.getContact();
                console.log(contact.number+" ===>>>> "+msg.body);
            } // if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) {
        console.log(error);
        client.sendMessage('6281235114745@c.us', 'Error on Apps');
    }//try catch
});