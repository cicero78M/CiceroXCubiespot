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

//Unit Test
import { createClient as _createClient } from './unitTest/database/newClient/createClient.js';
import { collectInstaLikes as _collectInstaLikes } from './unitTest/collecting/insta/collectInstaLikes.js';
import { reportInstaLikes as _reportInstaLikes } from './unitTest/reporting/insta/reportInstaLikes.js';
import { editProfile as _editProfile } from './unitTest/database/editData/userData/editUserProfile.js';
import { pushUserClient as _pushUserClient } from './unitTest/database/newClient/pushUserClient.js';
import { updateUsername as _updateUsername } from './unitTest/database/editData/userData/updateUsername.js';
import { collectTiktokComments as _collectTiktokComments } from './unitTest/collecting/tiktok/collectTiktokEngagements.js';
import { instaSW as _instaSW } from './unitTest/collecting/whatsapp/instaSW.js';
import { instaLoadClients as _instaLoadClients } from './unitTest/bridge/instaLoadClients.js';
import { tiktokLoadClients as _tiktokLoadClients } from './unitTest/bridge/tiktokLoadClients.js';
import { reportTiktokComments as _reportTiktokComments } from './unitTest/reporting/tiktok/reportTiktokComments.js';
import { addNewUser as _addNewUser } from './unitTest/database/editData/userData/addNewUser.js';
import { checkMyData as _checkMyData } from './unitTest/database/checkMyData.js';
import { usernameAbsensi as _usernameAbsensi } from './unitTest/database/usernameAbsensi.js';
import { sheetDoc as _sheetDoc } from '../queryData/sheetDoc.js';

 
const port = ciceroKey.port;

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: ciceroKey.waSession,
    }),
});

//initialize 
client.initialize();
//Check if autenticated
client.on('authenthicated', (session)=>{
    console.log(session);
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
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

    schedule('00 15/21 * * *', async () => {

        let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
        let clientRows = clientResponse.data;

        for (let i = 0; i < clientRows.length; i++) {

            if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('INSTA_STATE') === "TRUE" && clientRows[i].get('TYPE') === ciceroKey.ciceroClientType) {

                let responseLoad = await _collectInstaLikes(clientRows[i].get('CLIENT_ID'));

                if (responseLoad.code === 200) {

                    let responseReport = await _reportInstaLikes(clientRows[i].get('CLIENT_ID'));
                                
                    if (responseReport.code === 202) {

                        console.log(responseReport.data);

                        client.sendMessage(clientRows[i].get('SUPERVISOR'), responseReport.data);
                        client.sendMessage(clientRows[i].get('OPERATOR'), responseReport.data);

                        if (clientRows[i].get('GROUP') !== null){

                            client.sendMessage(clientRows[i].get('group'), responseReport.data);

                        }

                    } else {

                        console.log(responseReport.data);
                    }

                } else {

                    console.log(responseLoad.data);
                }

            }
        }

    });

    schedule('05 15/21 * * *', async () => {

        let responseList = [];
    
        let clientResponse = await _sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
        let clientRows = clientResponse.data;
    
        for (let i = 0; i < clientRows.length; i++) {
    
            if (clientRows[i].get('STATUS') === "TRUE" && clientRows[i].get('TIKTOK_STATE') === "TRUE" && clientRows[i].get('TYPE') === typeOrg) {
    
                let responseLoad = await _collectTiktokComments(clientRows[i].get('CLIENT_ID'));
    
                if (responseLoad.code === 200) {
    
                    responseList.push(responseLoad);
    
                    let responseReport = await _reportTiktokComments(clientRows[i].get('CLIENT_ID'));
    
                    if (responseReport.code === 202) {

                        console.log(responseReport.data);
    
                        client.sendMessage(clientRows[i].get('SUPERVISOR'), responseReport.data);
                        client.sendMessage(clientRows[i].get('OPERATOR'), responseReport.data);

                        if (clientRows[i].get('GROUP') !== null){

                            client.sendMessage(clientRows[i].get('group'), responseReport.data);


                        }    
                    } else {
                        console.log(responseReport.data);
                    }
    
                } else {
                    console.log(responseLoad.data);
                }
    
            }
        }

    });

    
    // Reload Insta every hours until 22.00
    schedule('50 6-22 * * *', async () => {

        let response = await _instaLoadClients(ciceroKey.ciceroClientType);

        if (response.length >= 1){
            for (let i = 0; i < response.length; i++){
                await client.sendMessage('6281235114745@c.us', response[i].data);

                /*
                for (let ii = 0; ii < response.phone.length; ii++){
                    console.log(response.phone[ii]+" Mengingatkan, anda belum melaksanakan Komentar dan Likes Konten Instagram Akun Resmi.");
                    
                }
                */                
            }
        }
    });

    // Reload Tiktok every hours until 22
    schedule('45 6-21 * * *', async () => {

        let response = await _tiktokLoadClients(ciceroKey.ciceroClientType);

        if (response.length >= 1){
            for (let i = 0; i < response.length; i++){
                await client.sendMessage('6281235114745@c.us', response[i].data);
                /*
                for (let ii = 0; ii < response.phone.length; ii++){
                    console.log(response.phone[ii]+" Mengingatkan, anda belum melaksanakan Komentar dan Likes Konten Tiktok Akun Resmi.");   
                } 
                */      
            }
        }
    });



});

client.on('qr', qr => {

    //Pairing WA Center
    generate(qr, {small: true});

});

client.on('message', async (msg) => {

    const adminOrder =['pushuserres', 'pushusercom','clientstate', 'reloadinstalikes', 'reloadtiktokcomments', 'reloadstorysharing', 'reloadallinsta', 'reloadalltiktok', 'reportinstalikes', 'reporttiktokcomments', 'reportwastory', 'exception'];
    const operatorOrder = ['addnewuser', 'deleteuser', 'instacheck', 'tiktokcheck'];
    const userOrder =['menu', 'mydata', 'updateinsta', 'updatetiktok','editnama','nama', 'editdivisi', 'editjabatan', 'ig', 'tiktok', 'jabatan']



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
             
                if (url !== null){
                    if (url[0].includes('instagram.com')){

                        if (url[0].includes('/p/') || url[0].includes('/reels/') || url[0].includes('/video/') ){

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
                    if (splittedMsg[1].toLowerCase() === 'pushnewuserres'){
                        //Res Request
                        console.log('Push User Client Triggered');

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
                    } else if (splittedMsg[1].toLowerCase() === 'pushnewusercom'){
                        //Company Request     
                        //ClientName#pushnewusercom#linkspreadsheet
                        
                        console.log('Push User Client Triggered');

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
                        
                    } else if (splittedMsg[1].toLowerCase() === 'reloadinstalikes') {
                        //Reload Likes from Insta Official
                        //ClientName#reloadinstalikes
                        let response = await _collectInstaLikes(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        } 
                    } else if (splittedMsg[1].toLowerCase() === 'reloadtiktokcomments') {
                        //Reload Comments from Tiktok Official
                        //ClientName#reloadtiktokcomments
                        let response = await _collectTiktokComments(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }  
                    } else if (splittedMsg[1].toLowerCase() === 'reportinstalikes') {
                        //Report Likes from Insta Official
                        //ClientName#reportinstalikes
                        let response = await _reportInstaLikes(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 202){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }  
                    } else if (splittedMsg[1].toLowerCase() === 'reporttiktokcomments') {
                        //Report Comments from Tiktok Official
                        //ClientName#reporttiktokcomments
                        let response = await _reportTiktokComments(splittedMsg[0].toUpperCase());

                        if (response.code === 202){
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }                     
                    } else if (splittedMsg[1].toLowerCase() === 'reloadallinsta'){
                        //Cicero#reloadallinsta

                        let response = await _instaLoadClients('RES');

                        if (response.length >= 1){
                            for (let i = 0; i < response.length; i++){
                                await client.sendMessage(msg.from, response[i].data);
                            }
                        }           

                    } else if (splittedMsg[1].toLowerCase() === 'reloadalltiktok'){
                        //Cicero#reloadalltiktok                        
                        let response = await _tiktokLoadClients('RES');

                        if (response.length >= 1){
                            for (let i = 0; i < response.length; i++){
                                await client.sendMessage(msg.from, response[i].data);
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
                        }   

                    } else if (splittedMsg[1].toLowerCase() === 'instacheck') {
                        //Checking If User hasn't update Insta Profile
                        let response = await _usernameAbsensi(splittedMsg[0].toUpperCase(), 'INSTA');
                                                            
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }  
                    } else if (splittedMsg[1].toLowerCase() === 'tiktokcheck') {
                        //Checking If User hasn't update Tiktok Profile
                        let response = await _usernameAbsensi(splittedMsg[0].toUpperCase(), 'TIKTOK');
                                                            
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }  
                    }

                //User Order Data         
                } else if (userOrder.includes(splittedMsg[1].toLowerCase())){//const userOrder =['menu', 'mydata','editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok', 'ig', 'tiktok', 'jabatan']
                    if (splittedMsg[1].toLowerCase() === 'updateinsta' || splittedMsg[1].toLowerCase() === 'ig') {
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
                                }                                   
                        
                            } else {
                                console.log('Bukan Link Profile Instagram');
                                client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                            }
                        
                        } else {
                            console.log('Bukan Link Profile Instagram');
                            client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                        }

                    } else if (splittedMsg[1].toLowerCase() === 'updatetiktok' || splittedMsg[1].toLowerCase() === 'tiktok') {
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
                            }                                   

                        } else {
                            console.log('Bukan Link Profile Tiktok');
                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                        }      
                    
                    } else if (splittedMsg[1].toLowerCase() === 'editdivisi' || splittedMsg[1].toLowerCase() === 'satfung') {
                        //update Divisi Name
                        //clientName#editdivisi/satfung#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "DIVISI");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }   

                    } else if (splittedMsg[1].toLowerCase() === 'editjabatan' || splittedMsg[1].toLowerCase() === 'jabatan') {
                        //Update Jabatan
                        //clientName#editjabatan/jabatan#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "JABATAN");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }   
                    } else if (splittedMsg[1].toLowerCase() === 'editnama' || splittedMsg[1].toLowerCase() === 'nama') {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await _editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "NAMA");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }   
                    } else if (splittedMsg[1].toLowerCase() === 'mydata') {
                        let response = await _checkMyData(splittedMsg[0].toUpperCase(), splittedMsg[2]);

                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }   
                    }

                //Key Order Data Not Exist         
                } else {
                    console.log("Request Code Doesn't Exist");
                    client.sendMessage(msg.from, "Request Order Key Tidak Terdaftar");
                }         
                //if(splittedMsg[1].toLowerCase()......
            } else {
                const contact = await msg.getContact();
                console.log(contact.number+" ===>>>> "+msg.body);
            } // if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) {
        console.log(error); 
    }//try catch
});