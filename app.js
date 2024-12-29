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
 
const port = ciceroKey.port;

const d = new Date();
const localDate = d.toLocaleDateString('id');
const hours = d.toLocaleTimeString('id');

const time = localDate+" >> "+hours;

app.listen(port, () => {
    console.log(time+` Cicero System Start listening on port >>> ${port}`)
});



const client = new Client({
    authStrategy: new LocalAuth({
        clientId: ciceroKey.waSession,
    }),

});

console.log(time+' Initializing...');

client.initialize();

client.on('authenthicated', (session)=>{
    console.log(time+' '+JSON.stringify(session));
});

client.on('auth_failure', msg => {
    console.error(time+' AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
    console.log(time+' Client was logged out', reason);
});

client.on('ready', () => {
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

    //Server Check Jobs
    schedule('*/10 * * * *', async () =>  {     
        console.log(time+' '+ciceroKey.waSession+' <<<System Alive>>>');
        await client.sendMessage('6281235114745@c.us', ciceroKey.waSession+' <<<System Alive>>>');
    });

 // Reload Tiktok every hours until 22
    schedule('40 6-21 * * *', async () => {
        try {
            await client.sendMessage('6281235114745@c.us', 'Cron Job Starting...');
            console.log(time+' Cron Job Starting...');
            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
            let clientRows = clientResponse.data;
            if (clientRows.length >= 1){
                for (let i = 0; i < clientRows.length; i++){
                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                        await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Tiktok Data');
                        console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                        let loadTiktok = await collectTiktokComments(clientRows[i].get('CLIENT_ID'));
                        if(loadTiktok.code === 200){
                            console.log(clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD TIKTOK DATA');
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Tiktok Data Success');
                            let reportTiktok = await reportTiktokComments(clientRows[i].get('CLIENT_ID'))
                            sendSuperviseResponse(clientRows[i].get('CLIENT_ID'), reportTiktok, "REPORT TIKTOK");
                        } else {
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' FAIL LOAD TIKTOK DATA');
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Tiktok Data Failed');
                        }
                    }
                    
                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                        await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Insta Data');
                        console.log(time+" "+clientRows[i].get('CLIENT_ID')+' STARTING LOAD INSTA DATA');
                        let loadInsta = await collectInstaLikes(clientRows[i].get('CLIENT_ID'));
                        if(loadInsta.code === 200){
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Insta Data Success');
                            let reportInsta = await reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                            sendSuperviseResponse(clientRows[i].get('CLIENT_ID'), reportInsta, "REPORT INSTA");
                        } else {
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' FAIL LOAD INSTA DATA');
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Insta Data Fail');
                        }
                    }      
                }
            }
        } catch (errorcronjob) {
            console.log(time+" "+errorcronjob)
            await client.sendMessage('6281235114745@c.us', 'Cron Job Error');
        }
    });

    // Reload Tiktok every hours until 15/18/21
    schedule('00 15,18,21 * * *', async () => {
        try {
            await client.sendMessage('6281235114745@c.us', 'Cron Job Starting...');            
            console.log(time+' Cron Job Starting');
            let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
            let clientRows = clientResponse.data;
            if (clientRows.length >= 1){
                for (let i = 0; i < clientRows.length; i++){
             
                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                        console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                        await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD TIKTOK DATA');
                        let loadTiktok = await collectTiktokComments(clientRows[i].get('CLIENT_ID'));
                        if(loadTiktok.code === 200){
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD TIKTOK DATA');
                            let reportTiktok = await reportTiktokComments(clientRows[i].get('CLIENT_ID'));
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),reportTiktok, ' REPORT TIKTOK');
                        } else {
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' TRY REPORT TIKTOK DATA');
                            let reportTiktok = await reportTiktokComments(clientRows[i].get('CLIENT_ID'));
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),reportTiktok, ' REPORT TIKTOK');
                        }
                    }
                    
                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                        console.log(time+" "+clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                        await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' START LOAD INSTA DATA');
                        let loadInsta = await collectInstaLikes(clientRows[i].get('CLIENT_ID'));
                        if(loadInsta.code === 200){
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');
                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_ID')+' SUCCESS LOAD INSTA DATA');                        
                            let reportInsta = await reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),reportInsta, ' REPORT INSTA');
                        } else {
                            console.log(time+" "+clientRows[i].get('CLIENT_ID')+' FAIL LOAD REPORT DATA');
                            let reportInsta = await reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                            sendClientResponse(clientRows[i].get('CLIENT_ID'), clientRows[i].get('SUPERVISOR'),clientRows[i].get('OPERATOR'),clientRows[i].get('GROUP'),reportInsta, ' REPORT INSTA');
                        }
                    } 
                }
            }
        } catch (errorcronjob) {
            console.log(time+" "+errorcronjob)
            await client.sendMessage('6281235114745@c.us', 'Cron Job Error');
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

    const adminOrder =['pushuserres', 'pushusercom','clientstate', 'allinsta', 'alltiktok', 'allsocmed', 'exception', 'savecontact'];
    const operatorOrder = ['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
    const userOrder =['mydata', 'updateinsta', 'updatetiktok','editnama','nama', 'editdivisi', 'editjabatan',  'pangkat', 'title','tiktok', 'jabatan', 'ig','ig1', 'ig2','ig3', 'insta'];
    const info = ['menu', 'divisilist', 'titlelist'];
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

                    client.sendMessage(msg.author, 'Terimakasih sudah berpartisipasi melakukan share konten :\n\n'+url[0]+'\n\nSelalu Semangat ya.');
                        
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
            
                if (adminOrder.includes(splittedMsg[1].toLowerCase())){//adminOrder =['pushuserres', 'pushusercom','clientstate', 'reloadinstalikes', 'reloadtiktokcomments', 'reloadstorysharing', 'reloadallinsta', 'reloadalltiktok', 'reportinstalikes', 'reporttiktokcomments', 'reportwastory'];
                    //ClientName#pushnewuserres#linkspreadsheet
                    if (splittedMsg[1].toLowerCase() === 'pushuserres'){
                        //Res Request
                        console.log('Push User Res Client Triggered');

                        if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){

                            console.log("Link True");
                        
                            console.log(splittedMsg[1].toUpperCase()+" Triggered");

                            let response = await pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "RES");
                            
                            if (response.code === 200){
                                console.log(response.data);
                                client.sendMessage(msg.from, response.data);
                            } else {
                                console.log(response.data);
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

                            let response = await pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "COM");
                            
                            if (response.code === 200){
                                console.log(response.data);
                                client.sendMessage(msg.from, response.data);
                            } else {
                                console.log(response.data);
                            }                          
                        } else {
                    
                            console.log('Bukan Spreadsheet Links');
                            client.sendMessage(msg.from, 'Bukan Spreadsheet Links');
    
                        }
                        
                    } else if (splittedMsg[1].toLowerCase() === 'allinsta') {
                        console.log('Reload All Insta');
                        let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                        let clientRows = clientResponse.data;    
                        if (clientRows.length >= 1){
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                    console.log('Starting...');
                                    let loadInsta = await collectInstaLikes(clientRows[i].get('CLIENT_ID'));
                                    if(loadInsta.code === 200){
                                        let reportInsta = await reportInstaLikes(clientRows[i].get('CLIENT_ID'));

                                        if(reportInsta.code === 200){
                                            client.sendMessage(msg.from, reportInsta.data);
                                        } else {
                                            client.sendMessage('6281235114745@c.us', reportInsta.data);
                                        }
                                    } else {
                                        client.sendMessage('6281235114745@c.us', reportInsta.data);
                                    }
    
                                }           
                            }
                        }

                    } else if (splittedMsg[1].toLowerCase() === 'alltiktok') {
                        console.log('Reload All TikTok');
                        let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                        let clientRows = clientResponse.data;
                        if (clientRows.length >= 1){
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                    console.log('Starting...');
                                    let loadTiktok = await collectTiktokComments(clientRows[i].get('CLIENT_ID'));


                                    if(loadTiktok.code === 200){
                                        let reportTiktok = await reportTiktokComments(clientRows[i].get('CLIENT_ID'))
                                        if(reportTiktok.code === 200){
                                            client.sendMessage('6281235114745@c.us', reportTiktok.data);
                                        } else {
                                            client.sendMessage('6281235114745@c.us', reportTiktok.data);

                                        }
                                    } else {
                                        client.sendMessage('6281235114745@c.us', reportTiktok.data);

                                    }
                                }           
                            }
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'allsocmed') {

                        try {

                            await client.sendMessage('6281235114745@c.us', 'Collecting Tiktok');
                    
                            console.log('Cron Job Tiktok');
                
                            let tiktokClientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let tiktokClientRows = tiktokClientResponse.data;
                            if (tiktokClientRows.length >= 1){
                                for (let i = 0; i < tiktokClientRows.length; i++){
                                    if (tiktokClientRows[i].get('STATUS') === "TRUE" && tiktokClientRows[i].get('TIKTOK_STATE') === "TRUE" && tiktokClientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                        console.log('Starting...');
                                        let loadTiktok = await collectTiktokComments(tiktokClientRows[i].get('CLIENT_ID'));
                                        if(loadTiktok.code === 200){
                                            let reportTiktok = await reportTiktokComments(tiktokClientRows[i].get('CLIENT_ID'))
                                            if(reportTiktok.code === 202){
                                                await client.sendMessage('6281235114745@c.us', reportTiktok.data);
                                            } else {
                                                await client.sendMessage('6281235114745@c.us', reportTiktok.data);
                                            }
                
                                        } else {
                                            await client.sendMessage('6281235114745@c.us', reportTiktok.data);
                                        }
                                    }           
                                }
                            }
                
                            try {
                            
                                client.sendMessage('6281235114745@c.us', 'Collecting Insta');
                                
                                let instaClientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                                let instaClientRows = instaClientResponse.data;    
                                if (instaClientRows.length >= 1){
                                    for (let i = 0; i < instaClientRows.length; i++){
                                        if (instaClientRows[i].get('STATUS') === "TRUE" && instaClientRows[i].get('INSTA_STATE') === "TRUE" && instaClientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                            console.log('Starting...');
                                            
                                            let loadInsta = await collectInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                            
                                            if(loadInsta.code === 200){
                                            
                                                let reportInsta = await reportInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                            
                                                if(reportInsta.code === 202){
                                                    await client.sendMessage('6281235114745@c.us', reportInsta.data);
                                                } else {
                                                    await client.sendMessage('6281235114745@c.us', reportInsta.data);
                                                }
                                            } else {
                                                await client.sendMessage('6281235114745@c.us', reportInsta.data);
                                            }
                                        }           
                                    }
                                }
                                
                            } catch (errorinsta) {
                                console.log(time+" "+errorinsta)
                                await client.sendMessage('6281235114745@c.us', 'Cron Job Insta  Error');
                            }
                
                        } catch (errortiktok) {
                            console.log(errortiktok)
                            await client.sendMessage('6281235114745@c.us', 'Cron Job Tiktok Error');

                            try {
                                await client.sendMessage('6281235114745@c.us', 'Collecting Insta');
                                let instaClientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                                let instaClientRows = instaClientResponse.data;    
                                if (instaClientRows.length >= 1){
                                    for (let i = 0; i < instaClientRows.length; i++){
                                        if (instaClientRows[i].get('STATUS') === "TRUE" && instaClientRows[i].get('INSTA_STATE') === "TRUE" && instaClientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                            console.log('Starting...');
                                            let loadInsta = await collectInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                            if(loadInsta.code === 200){
                                                let reportInsta = await reportInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                                if(reportInsta.code === 202){
                                                    await client.sendMessage('6281235114745@c.us', reportInsta.data);
                                                } else {
                                                    await client.sendMessage('6281235114745@c.us', reportInsta.data);
                                                }
                                            } else {
                                                await client.sendMessage('6281235114745@c.us', reportInsta.data);
                                            }
                                        }           
                                    }
                                }
                            } catch (errorinsta) {
                                console.log(time+" "+errorinsta)
                                await client.sendMessage('6281235114745@c.us', 'Cron Job Insta  Error');
                            }
                        }

                    } else if (splittedMsg[1].toLowerCase() === 'createClientData'){

                        let response = await createClient(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase());

                        for (let i = 0; i < response.length; i++){

                            console.log(response[i].data);
                            client.sendMessage(msg.from, response[i].data);

                        }                   
                    } else if (splittedMsg[1].toLowerCase() === 'exception') {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "EXCEPTION");
                        
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
                    //clientName#addnewuser#id_key/NRP#name#divisi/satfung#jabatan#pangkat/title
                    if (splittedMsg[1].toLowerCase() === 'addnewuser'){ 
                        //Check Between Corporate And Organizations
                                               
                        let responseData = await addNewUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase());
                        sendResponse(msg.from, responseData, "Error Adding New User");

                    } else if (splittedMsg[1].toLowerCase() === 'deleteuser') {
                        //Update Nama
                        //clientName#deleteuser#id_key/NRP#newdata
                        let responseData = await editProfile(splittedMsg[0].toUpperCase(), splittedMsg[2].toLowerCase(), false, msg.from.replace('@c.us', ''), "STATUS");
                        sendResponse(msg.from, responseData, "Error Delete User Data");
  
                    } else if (splittedMsg[1].toLowerCase() === 'instacheck') {
                        //Checking If User hasn't update Insta Profile
                        let response = await usernameAbsensi(splittedMsg[0].toUpperCase(), 'INSTA');
                                                            
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on Insta User*');
                        }  
                    } else if (splittedMsg[1].toLowerCase() === 'tiktokcheck') {
                        //Checking If User hasn't update Tiktok Profile
                        let response = await usernameAbsensi(splittedMsg[0].toUpperCase(), 'TIKTOK');
                                                            
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on Tiktok User*');
                        }  
                    }

                //User Order Data         
                } else if (userOrder.includes(splittedMsg[1].toLowerCase())){//const userOrder =['menu', 'mydata','editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok', 'ig', 'tiktok', 'jabatan']
                    if (['updateinsta', 'ig', 'ig1', 'ig2','ig3', 'insta'].includes(splittedMsg[1].toLowerCase())) {
                    //Update Insta Profile
                    //CLientName#updateinsta/ig/#linkprofileinstagram
                        if (splittedMsg[3].includes('instagram.com')){
                            if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
                                const instaLink = splittedMsg[3].split('?')[0];
                                const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  
                                let responseData = await updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], instaUsername, contact.number, "updateinstausername");
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
                            sendResponse(msg.from, responseData, "Error Update Tiktok");
                        } else {
                            console.log('Bukan Link Profile Tiktok');
                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                        }      
                    } else if (['editdivisi', 'satfung' ].includes(splittedMsg[1].toLowerCase())) {
                        //update Divisi Name
                        //clientName#editdivisi/satfung#id_key/NRP#newdata
                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "DIVISI");
                        sendResponse(msg.from, responseData, "Error Edit Satfung");
                    } else if (['editjabatan', 'jabatan'].includes(splittedMsg[1].toLowerCase())) {
                        //Update Jabatan
                        //clientName#editjabatan/jabatan#id_key/NRP#newdata
                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "JABATAN");
                        sendResponse(msg.from, responseData, "Error Edit Jabatan");
                    } else if (['editnama', 'nama'].includes(splittedMsg[1].toLowerCase())) {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "NAMA");
                        sendResponse(msg.from, responseData, "Error Edit Nama");
                    } else if (['editpangkat', 'ubahpangkat', 'pangkat', 'title'].includes(splittedMsg[1].toLowerCase())) {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let responseData = await editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "PANGKAT");
                        sendResponse(msg.from, responseData, "Error Edit Pangkat");
                    } else if (splittedMsg[1].toLowerCase() === 'mydata') {
                        let responseData = await myData(splittedMsg[0].toUpperCase(), splittedMsg[2]);
                        sendResponse(msg.from, responseData, "Error on Getting My Data");
                    }

                } else if (info.includes(splittedMsg[1].toLowerCase())){//    const info = ['menu', 'divisilist', 'titlelist'];
                    if (splittedMsg[1].toLowerCase() === 'menu') {
                        let responseData = await infoView(splittedMsg[0].toUpperCase());
                        client.sendMessage(msg.from, responseData.data);
                    } else if (splittedMsg[1].toLowerCase() === 'divisilist') {
                       let responseData = await propertiesView(splittedMsg[0].toUpperCase(), "DIVISI");
                       client.sendMessage(msg.from, responseData.data);                                  
                    } else if (splittedMsg[1].toLowerCase() === 'titlelist') {
                        let responseData = await propertiesView(splittedMsg[0].toUpperCase(), "TITLE");
                        client.sendMessage(msg.from, responseData.data);                                   
                    }

                //Key Order Data Not Exist         
                } else {
                    console.log("Request Code Doesn't Exist");
                    let responseData = await infoView(splittedMsg[0].toUpperCase());

                    client.sendMessage(msg.from, responseData.data);
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

/*This Function Must be Created Here*/
//Response By User
function sendResponse(from, responseData, errormessage) {
    switch (responseData.code){
        case 200:
            console.log(responseData.data);
            client.sendMessage(from, responseData.data);
            break;
        case 201:
            console.log(response.data);
            client.sendMessage(from, responseData.data);
            break;
        case 303:                                
            console.log(responseData.data);
            client.sendMessage(from, errormessage);
            break;
    }   
}

//Response By Client
function sendClientResponse(clientID, supervisor, operator, group, data, type) {
    if(data.code === 200){
        console.log(time+" "+clientID+' SUCCESS '+type+' DATA');
        client.sendMessage(supervisor, data.data);
        client.sendMessage(operator, data.data);
        client.sendMessage(group, data.data);
    } else {
        console.log(time+" "+clientID+' FAIL '+type+' DATA');
        client.sendMessage('6281235114745@c.us', data.data);
    }
}

//Response By Client
function sendSuperviseResponse(clientID, data, type) {
    if(data.code === 200){
        console.log(time+" "+clientID+" SUCESS "+type+" DATA");
        client.sendMessage('6281235114745@c.us', data.data);
    } else {
        console.log(time+" "+clientID+" FAIL "+type+" DATA");
        client.sendMessage('6281235114745@c.us', data.data);
    }
}