import { readFileSync } from 'fs';
import express from 'express';
const app = express();

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;

import qrcode from 'qrcode-terminal';
const { generate } = qrcode;

import figlet from 'figlet';
const { textSync } = figlet;

import { set } from 'simple-banner';
import { schedule } from 'node-cron';

import { createClient as _createClient } from './unitTest/database/newClient/createClient.js';
import { collectInstaLikes as _collectInstaLikes } from './unitTest/collecting/insta/collectInstaLikes.js';
import { reportInstaLikes as _reportInstaLikes } from './unitTest/reporting/insta/reportInstaLikes.js';
import { editProfile as _editProfile } from './unitTest/database/editData/userData/editUserProfile.js';
import { pushUserClient as _pushUserClient } from './unitTest/database/newClient/pushUserClient.js';
import { updateUsername as _updateUsername } from './unitTest/database/editData/userData/updateUsername.js';
import { collectTiktokComments as _collectTiktokComments } from './unitTest/collecting/tiktok/collectTiktokEngagements.js';
import { instaSW as _instaSW } from './unitTest/collecting/whatsapp/instaSW.js';
import { reportTiktokComments as _reportTiktokComments } from './unitTest/reporting/tiktok/reportTiktokComments.js';
import { addNewUser as _addNewUser } from './unitTest/database/editData/userData/addNewUser.js';
import { checkMyData as _checkMyData } from './unitTest/database/checkMyData.js';
import { usernameAbsensi as _usernameAbsensi } from './unitTest/database/usernameAbsensi.js';
import { sheetDoc as _sheetDoc } from './unitTest/queryData/sheetDoc.js';
 
const port = ciceroKey.port;

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: ciceroKey.waSession,
    }),
});

client.initialize();

client.on('authenthicated', (session)=>{
    console.log(session);
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
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

        console.log(ciceroKey.waSession+' <<<System Alive>>>');
        await client.sendMessage('6281235114745@c.us', ciceroKey.waSession+' <<<System Alive>>>');
            
    });

 // Reload Tiktok every hours until 22
    schedule('50 6-21 * * *', async () => {
        try {

            await client.sendMessage('6281235114745@c.us', 'Collecting Tiktok');
    
            console.log('Cron Job Tiktok');

            let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
            let clientRows = clientResponse.data;
            if (clientRows.length >= 1){
                for (let i = 0; i < clientRows.length; i++){

                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {

                        await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Tiktok Data');
                        console.log('Starting...');

                        let loadTiktok = await _collectTiktokComments(clientRows[i].get('CLIENT_ID'));
                        if(loadTiktok.code === 200){
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Tiktok Data Success');

                            let reportTiktok = await _reportTiktokComments(clientRows[i].get('CLIENT_ID'))
                            if(reportTiktok.code === 202){
                                await client.sendMessage('6281235114745@c.us', reportTiktok.data);
                            } else {
                                await client.sendMessage('6281235114745@c.us', reportTiktok.data);
                            }

                        } else {
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Tiktok Data Failed');
                        }
                    }
                    
                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                        await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Insta Data');

                        console.log('Starting...');
                        
                        let loadInsta = await _collectInstaLikes(clientRows[i].get('CLIENT_ID'));
                        
                        if(loadInsta.code === 200){
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Insta Data Success');
   
                            let reportInsta = await _reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                        
                            if(reportInsta.code === 202){
                                await client.sendMessage('6281235114745@c.us', reportInsta.data);
                            } else {
                                await client.sendMessage('6281235114745@c.us', reportInsta.data);
                            }
                        } else {
                            await client.sendMessage('6281235114745@c.us', 'Collect '+clientRows[i].get('CLIENT_ID')+' Insta Data Fail');

                        }
                    }      
                }
            }

        } catch (errortiktok) {
            
            console.log(errortiktok)
            await client.sendMessage('6281235114745@c.us', 'Cron Job Tiktok Error');
        }
    });

    // Reload Tiktok every hours until 15/18/21
    schedule('00 15,18,21 * * *', async () => {
        try {

            await client.sendMessage('6281235114745@c.us', 'Collecting Tiktok');
            
            console.log('Cron Job Tiktok');
            
            let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
            let clientRows = clientResponse.data;
            
            if (clientRows.length >= 1){
                for (let i = 0; i < clientRows.length; i++){

                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                        
                        console.log('Starting...');

                        let loadTiktok = await _collectTiktokComments(clientRows[i].get('CLIENT_ID'));
                        if(loadTiktok.code === 200){
                            let reportTiktok = await _reportTiktokComments(clientRows[i].get('CLIENT_ID'))
                            if(reportTiktok.code === 202){
                 
                                await client.sendMessage(clientRows[i].get('SUPERVISOR'), reportTiktok.data);
                                await client.sendMessage(clientRows[i].get('OPERATOR'), reportTiktok.data);
                                await client.sendMessage(clientRows[i].get('GROUP'), reportTiktok.data);
                                
                            } else {
                                await client.sendMessage('6281235114745@c.us', reportTiktok.data);
                            }

                        } else {

                            let reportTiktok = await _reportTiktokComments(clientRows[i].get('CLIENT_ID'))
                            
                               if(reportTiktok.code === 202){
                 
                                await client.sendMessage(clientRows[i].get('SUPERVISOR'), reportTiktok.data);
                                await client.sendMessage(clientRows[i].get('OPERATOR'), reportTiktok.data);
                                await client.sendMessage(clientRows[i].get('GROUP'), reportTiktok.data);
                                
                            } else {
                                await client.sendMessage('6281235114745@c.us', reportTiktok.data);
                            }
                       }
                    }
                    
                    if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         

                        console.log(clientRows[i].get('CLIENT_')+' START LOAD INSTA DATA');
                        await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_')+' START LOAD INSTA DATA');

                        console.log('Starting...');

                        let loadInsta = await _collectInstaLikes(clientRows[i].get('CLIENT_ID'));

                        if(loadInsta.code === 200){
                            
                            console.log(clientRows[i].get('CLIENT_')+' SUCCESS LOAD INSTA DATA');
                            await client.sendMessage('6281235114745@c.us', clientRows[i].get('CLIENT_')+' SUCCESS LOAD INSTA DATA');
                        
                            let reportInsta = await _reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                        
                            if(reportInsta.code === 202){

                                await client.sendMessage(clientRows[i].get('SUPERVISOR'), reportInsta.data);
                                await client.sendMessage(clientRows[i].get('OPERATOR'), reportInsta.data);
                                await client.sendMessage(clientRows[i].get('GROUP'), reportInsta.data);

                            } else {

                                await client.sendMessage('6281235114745@c.us', reportInsta.data);
                            
                            }

                        } else {
                        
                            let reportInsta = await _reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                        
                            if(reportInsta.code === 202){

                                await client.sendMessage(clientRows[i].get('SUPERVISOR'), reportInsta.data);
                                await client.sendMessage(clientRows[i].get('OPERATOR'), reportInsta.data);
                                await client.sendMessage(clientRows[i].get('GROUP'), reportInsta.data);

                            } else {
                        
                                await client.sendMessage('6281235114745@c.us', reportInsta.data);
                        
                            }
    
                        }
                    } 
                }
            }
                   
        } catch (errorTiktok) {
            
            console.log(errorTiktok)
            await client.sendMessage('6281235114745@c.us', 'Cron Job Tiktok Error');
        }
    });

});

client.on('qr', qr => {

    //Pairing WA Center
    generate(qr, {small: true});

});

client.on('message', async (msg) => {

    const adminOrder =['pushuserres', 'pushusercom','clientstate', 'allinsta', 'alltiktok', 'allsocmed', 'exception'];
    const operatorOrder = ['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
    const userOrder =['menu', 'mydata', 'updateinsta', 'updatetiktok','editnama','nama', 'editdivisi', 'editjabatan',  'pangkat', 'title','tiktok', 'jabatan', 'ig','ig1', 'ig2','ig3', 'insta'];

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

                let splittedUrl = url.replace("?", "");

                if (splittedUrl.length >=1){
               if (splittedUrl.includes("www.instagram.com")){

                    console.log('Response Sent');

                    client.sendMessage(msg.author, 'Terimakasih sudah berpartisipasi melakukan share konten :\n\n'+url+'\n\nSelalu Semangat ya.');
                        
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

                            let response = await _pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "RES");
                            
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

                            let response = await _pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "COM");
                            
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
                        let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                        let clientRows = clientResponse.data;    
                        if (clientRows.length >= 1){
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                    console.log('Starting...');
                                    let loadInsta = await _collectInstaLikes(clientRows[i].get('CLIENT_ID'));
                                    if(loadInsta.code === 200){
                                        let reportInsta = await _reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                                        if(reportInsta.code === 202){
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
                        let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                        let clientRows = clientResponse.data;
                        if (clientRows.length >= 1){
                            for (let i = 0; i < clientRows.length; i++){
                                if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                    console.log('Starting...');
                                    let loadTiktok = await _collectTiktokComments(clientRows[i].get('CLIENT_ID'));
                                    if(loadTiktok.code === 200){
                                        let reportTiktok = await _reportTiktokComments(clientRows[i].get('CLIENT_ID'))
                                        if(reportTiktok.code === 202){
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
                
                            let tiktokClientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                            let tiktokClientRows = tiktokClientResponse.data;
                            if (tiktokClientRows.length >= 1){
                                for (let i = 0; i < tiktokClientRows.length; i++){
                                    if (tiktokClientRows[i].get('STATUS') === "TRUE" && tiktokClientRows[i].get('TIKTOK_STATE') === "TRUE" && tiktokClientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {
                                        console.log('Starting...');
                                        let loadTiktok = await _collectTiktokComments(tiktokClientRows[i].get('CLIENT_ID'));
                                        if(loadTiktok.code === 200){
                                            let reportTiktok = await _reportTiktokComments(tiktokClientRows[i].get('CLIENT_ID'))
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
                                
                                let instaClientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                                let instaClientRows = instaClientResponse.data;    
                                if (instaClientRows.length >= 1){
                                    for (let i = 0; i < instaClientRows.length; i++){
                                        if (instaClientRows[i].get('STATUS') === "TRUE" && instaClientRows[i].get('INSTA_STATE') === "TRUE" && instaClientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                            console.log('Starting...');
                                            
                                            let loadInsta = await _collectInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                            
                                            if(loadInsta.code === 200){
                                            
                                                let reportInsta = await _reportInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                            
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
                                
                                console.log(errorinsta)
                                await client.sendMessage('6281235114745@c.us', 'Cron Job Insta  Error');
                            }
                
                        } catch (errortiktok) {
                            
                            console.log(errortiktok)
                            await client.sendMessage('6281235114745@c.us', 'Cron Job Tiktok Error');
                
                            try {
                            
                                await client.sendMessage('6281235114745@c.us', 'Collecting Insta');
                                
                                let instaClientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
                                let instaClientRows = instaClientResponse.data;    
                                if (instaClientRows.length >= 1){
                                    for (let i = 0; i < instaClientRows.length; i++){
                                        if (instaClientRows[i].get('STATUS') === "TRUE" && instaClientRows[i].get('INSTA_STATE') === "TRUE" && instaClientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {         
                                            
                                            console.log('Starting...');
                                            
                                            let loadInsta = await _collectInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                            
                                            if(loadInsta.code === 200){
                                            
                                                let reportInsta = await _reportInstaLikes(instaClientRows[i].get('CLIENT_ID'));
                                            
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
                                
                                console.log(errorinsta)
                                await client.sendMessage('6281235114745@c.us', 'Cron Job Insta  Error');
                            }
                        }


                    } else if (splittedMsg[1].toLowerCase() === 'createClientData'){

                        let response = await _createClient(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase());

                        for (let i = 0; i < response.length; i++){

                            console.log(response[i].data);
                            client.sendMessage(msg.from, response[i].data);

                        }                   
                    } else if (splittedMsg[1].toLowerCase() === 'exception') {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "EXCEPTION");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', 'Response Error from Exceptions');

                        }   
                    }
                                            
                //Operator Order Data         
                } else if (operatorOrder.includes(splittedMsg[1].toLowerCase())){//['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
                    //clientName#addnewuser#id_key/NRP#name#divisi/satfung#jabatan#pangkat/title
                    if (splittedMsg[1].toLowerCase() === 'addnewuser'){ 
                        //Check Between Corporate And Organizations
                        
                        let response = await _addNewUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase());
                        
                        if(response.code === 1){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on Add New User*');

                        }                          

                    } else if (splittedMsg[1].toLowerCase() === 'deleteuser') {
                        //Update Nama
                        //clientName#deleteuser#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(), splittedMsg[2].toLowerCase(), false, msg.from.replace('@c.us', ''), "STATUS");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on Delete User*');

                        }   

                    } else if (splittedMsg[1].toLowerCase() === 'instacheck') {
                        //Checking If User hasn't update Insta Profile
                        let response = await _usernameAbsensi(splittedMsg[0].toUpperCase(), 'INSTA');
                                                            
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on Insta User*');

                        }  
                    } else if (splittedMsg[1].toLowerCase() === 'tiktokcheck') {
                        //Checking If User hasn't update Tiktok Profile
                        let response = await _usernameAbsensi(splittedMsg[0].toUpperCase(), 'TIKTOK');
                                                            
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
                                let response = await _updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], instaUsername, contact.number, "updateinstausername");
                                if(response.code === 200){
                                    console.log(response.data);
                                    client.sendMessage(msg.from, response.data);
                                } else {
                                    console.log(response.data);
                                    client.sendMessage('6281235114745@c.us', '*Response Error on Update Insta*');
                                }                                   
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
                            let response = await _updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], tiktokUsername, contact.number, "updatetiktokusername");
                            if(response.code === 200){
                                console.log(response.data);
                                client.sendMessage(msg.from, response.data);
                            } else {
                                console.log(response.data);
                                client.sendMessage('6281235114745@c.us', '*Response Error on Update Tiktok*');
                            }                                   
                        } else {
                            console.log('Bukan Link Profile Tiktok');
                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                        }      
                    } else if (['editdivisi', 'satfung' ].includes(splittedMsg[1].toLowerCase())) {
                        //update Divisi Name
                        //clientName#editdivisi/satfung#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "DIVISI");
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on edit Divisi*');
                        }   
                    } else if (['editjabatan', 'jabatan'].includes(splittedMsg[1].toLowerCase())) {
                        //Update Jabatan
                        //clientName#editjabatan/jabatan#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "JABATAN");
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on edit Jabatan*');
                        }   
                    } else if (['editnama', 'nama'].includes(splittedMsg[1].toLowerCase())) {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "NAMA");
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on edit Nama*');
                        }   
                    } else if (['editpangkat', 'ubahpangkat', 'pangkat', 'title'].includes(splittedMsg[1].toLowerCase())) {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "PANGKAT");
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on edit Pangkat*');
                        }   
                    } else if (splittedMsg[1].toLowerCase() === 'mydata') {
                        let response = await _checkMyData(splittedMsg[0].toUpperCase(), splittedMsg[2]);
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                            client.sendMessage('6281235114745@c.us', '*Response Error on Ask My Data*');
                        }   
                    }
                //Key Order Data Not Exist         
                } else {
                    console.log("Request Code Doesn't Exist");
                    client.sendMessage(msg.from, "Request Code Tidak Terdaftar");
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