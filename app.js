const fs = require('fs');
const express = require('express');
const app = express();

const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

const { Client , LocalAuth } = require('whatsapp-web.js');

const figlet = require('figlet');
const banner = require('simple-banner');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

//Unit Test
const createClient = require('./unitTest/database/newClient/createClient');
const collectInstaLikes = require('./unitTest/collecting/insta/collectInstaLikes');
const reportInstaLikes = require('./unitTest/reporting/insta/reportInstaLikes');
const editProfile = require('./unitTest/database/editData/userData/editUserProfile');
const pushUserClient = require('./unitTest/database/newClient/pushUserClient');
const updateUsername = require('./unitTest/database/editData/userData/updateUsername');
const collectTiktokComments = require('./unitTest/collecting/tiktok/collectTiktokEngagements');
const instaSW = require('./unitTest/collecting/whatsapp/instaSW');
const instaLoadClients = require('./unitTest/bridge/instaLoadClients');
const tiktokLoadClients = require('./unitTest/bridge/tiktokLoadClients.js');
const reportTiktokComments = require('./unitTest/reporting/tiktok/reportTiktokComments.js');
const addNewUser = require('./unitTest/database/editData/userData/addNewUser.js');
const checkMyData = require('./unitTest/database/checkMyData.js');
 
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

    console.log(figlet.textSync("CICERO -X- CUBIESPOT", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    banner.set("Cicero System Manajemen As A Services");
    console.log('===============================');
    console.log('===============================');
    console.log('======System Fully Loaded!=====');
    console.log('=========Enjoy the Ride========');
    console.log('===We\'ll Take Care Everything==');
    console.log('===============================');
    console.log('===============================');

    //Server Check Jobs
    cron.schedule('*/10 * * * *', async () =>  {     

        console.log('CUBIESPOT <<<System Alive>>>');
        await client.sendMessage('6281235114745@c.us', 'CUBIESPOT <<<System Alive>>>');
            
    });
    
    // Reload Insta every hours until 22.00
    cron.schedule('0 6-22 * * *', async () => {

        let response = await instaLoadClients.instaLoadClients('RES');

        if (response.length >= 1){
            for (let i = 0; i < response.length; i++){
                await client.sendMessage('6281235114745@c.us', response[i].data);
            }
        }

    });

    // Reload Tiktok every hours until 22
    cron.schedule('55 6-21 * * *', async () => {

        let response = await tiktokLoadClients.tiktokLoadClients('RES');

        if (response.length >= 1){
            for (let i = 0; i < response.length; i++){
                await client.sendMessage('6281235114745@c.us', response[i].data);
            }
        }

    });

});

client.on('qr', qr => {

    //Pairing WA Center
    qrcode.generate(qr, {small: true});

});

client.on('message', async (msg) => {

    const newClientOrder = ['newclientres', 'newclientcom', 'pushuserres', 'pushusercom'];
    const updateUserData = ['addnewuser', 'editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok', 'ig', 'tiktok', 'jabatan', 'satfung', 
        'status', 'idkey', 'deleteuser'];
    const dataOrder = ['menu', 'mydata', 'instacheck', 'tiktokcheck', 'clientstate'];
    const reloadOrder = ['reloadinstalikes', 'reloadtiktokcomments', 'reloadstorysharing', 'reloadallinsta', 'reloadalltiktok'];
    const reportOrder = ['reportinstalikes', 'reporttiktokcomments', 'reportwastory'];

    const unitTest = ['createclient', 'pushclientuser', 'collectinstalikes', 'instalikesreport', , 'collecttiktokengagements', 'tiktokcommentsreport', 'swtest','crontestinsta', 'crontesttiktok' ];
    const editdata = ['id_key', 'nama', 'title', 'jabatan', 'divisi', 'status'];
    const updateUser = ['updateinstausername','updatetiktokusername' ];

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
                               
                            let rawLink;
                            
                            if(url[0].includes('/?')){
                                rawLink = url[0].replaceAll('/?', '?');
                                shortcode = rawLink.split('?')[0].split('/').pop();
                            } else {
                                shortcode = url[0].split('/').pop();
                            }

                            //Report Likes from Insta Official
                            let response = await instaSW.instaSW(contact.number, shortcode);
                        
                            if (response.code === 200){
                                client.sendMessage(msg.from, response.data);
                            } else {
                                console.log(response.data);
                            } 
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
            
                if (newClientOrder.includes(splittedMsg[1].toLowerCase())){//const newClientOrder = ['newclientres', 'newclientcom' ];
                    //ClientName#newclientres/newclientcom#linkspreadsheet
                    if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
                        //Is contains Links
                        if (['newclientres', 'pushuserres'].includes(splittedMsg[1].toLowerCase())){
                            //Res Request
                            console.log('Push User Client Triggered');

                            if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
    
                                console.log("Link True");
                            
                                console.log(splittedMsg[1].toUpperCase()+" Triggered");
    
                                let response = await pushUserClient.pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "RES");
                                
                                if (response.code === 200){
                                    console.log(response.data);
                                    client.sendMessage(msg.from, response.data);
                                } else {
                                    console.log(response.data);
                                }                          
                            }  
                        }  else if (splittedMsg[1].toLowerCase() === "newclientcom"){
                            //Company Request 
                            
                            console.log('Push User Client Triggered');

                            if (splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
    
                                console.log("Link True");
                                
                                console.log(splittedMsg[1].toUpperCase()+" Triggered");
    
                                let response = await pushUserClient.pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[2], "COM");
                                
                                if (response.code === 200){
                                    console.log(response.data);
                                    client.sendMessage(msg.from, response.data);
                                } else {
                                    console.log(response.message);
                                }                          
                            }  
                        }
                    } else {
                        
                        console.log('Bukan Spreadsheet Links');
                        client.sendMessage(msg.from, 'Bukan Spreadsheet Links');

                    }       
                //Update Data         
                } else if (updateUserData.includes(splittedMsg[1].toLowerCase())){//const updateUserData = ['addnewuser', 'editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok'];
                    //clientName#addnewuser#id_key/NRP#name#divisi/satfung#jabatan#pangkat/title
                    if (splittedMsg[1].toLowerCase() === 'addnewuser'){ 
                        //Check Between Corporate And Organizations
                        
                        let response = await addNewUser.addNewUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), 
                        splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase());
                        
                        if(response.code === 1){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }                          
            
                    } else if (splittedMsg[1].toLowerCase() === 'editdivisi' || splittedMsg[1].toLowerCase() === 'satfung') {
                        //update Divisi Name
                    //clientName#editdivisi/satfung#id_key/NRP#newdata
                    let response = await editProfile.editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "DIVISI");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }   

                    } else if (splittedMsg[1].toLowerCase() === 'editjabatan' || splittedMsg[1].toLowerCase() === 'jabatan') {
                        //Update Jabatan
                        //clientName#editjabatan/jabatan#id_key/NRP#newdata
                        let response = await editProfile.editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "JABATAN");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }   
                    } else if (splittedMsg[1].toLowerCase() === 'editnama' || splittedMsg[1].toLowerCase() === 'nama') {
                        //clientName#editnama/nama#id_key/NRP#newdata
                        let response = await editProfile.editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "NAMA");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }   

                    } else if (splittedMsg[1].toLowerCase() === 'deleteuser') {
                        //Update Nama
                        //clientName#deleteuser#id_key/NRP#newdata
                        let response = await editProfile.editProfile(splittedMsg[0].toUpperCase(), false, splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), "STATUS");
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }   

                    } else if (splittedMsg[1].toLowerCase() === 'updateinsta' || splittedMsg[1].toLowerCase() === 'ig') {
                        //Update Insta Profile
                        //CLientName#updateinsta/ig/#linkprofileinstagram
                            if (splittedMsg[3].includes('instagram.com')){

                                if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
    
                                    const instaLink = splittedMsg[3].split('?')[0];
        
                                    const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  
                            
                                    let response = await updateUsername.updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], instaUsername, contact.number, "updateinstausername");
                                
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
                    
                            let response = await updateUsername.updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], tiktokUsername, contact.number, "updatetiktokusername");
                        
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
                    }
                //Data Order
                } else if (dataOrder.includes(splittedMsg[1].toLowerCase())){//const dataOrder = ['mydata','instacheck', 'tiktokcheck', 'clientstate'];
                    if (splittedMsg[1].toLowerCase() === 'instacheck') {
                        //Checking If User hasn't update Insta Profile

                    } else if (splittedMsg[1].toLowerCase() === 'tiktokcheck') {
                        //Checking If User hasn't update Tiktok Profile
                        
                    } else if (splittedMsg[1].toLowerCase() === 'mydata'){
                        //User Checking myData
                        let response = await checkMyData.checkMyData(splittedMsg[0].toUpperCase(), splittedMsg[2]);
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        }

                    } else if (splittedMsg[1].toLowerCase() === 'clientstate'){
                   
                    }
                //Reload Data       
                } else if (reloadOrder.includes(splittedMsg[1].toLowerCase())){//const reloadOrder = ['reloadinstalikes', 'reloadtiktokcomments', 'reloadstorysharing'];
                    if (splittedMsg[1].toLowerCase() === 'reloadinstalikes') {
                        //Reload Likes from Insta Official
                        //ClientName#reloadinstalikes
                        response = await collectInstaLikes.collectInstaLikes(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        } 

                    } else if (splittedMsg[1].toLowerCase() === 'reloadtiktokcomments') {
                        //Reload Comments from Tiktok Official
                        //ClientName#reloadtiktokcomments
                        response = await collectTiktokComments.collectTiktokComments(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }  

                    } else if (splittedMsg[1].toLowerCase() === 'reloadallinsta'){
                        //Cicero#reloadallinsta

                        let response = await instaLoadClients.instaLoadClients('RES');

                        if (response.length >= 1){
                            for (let i = 0; i < response.length; i++){
                                await client.sendMessage(msg.from, response[i].data);
                            }
                        }           

                    } else if (splittedMsg[1].toLowerCase() === 'reloadalltiktok'){
                        //Cicero#reloadalltiktok                        
                        let response = await tiktokLoadClients.tiktokLoadClients('RES');

                        if (response.length >= 1){
                            for (let i = 0; i < response.length; i++){
                                await client.sendMessage(msg.from, response[i].data);
                            }
                        } 
                    }
                //Reporting
                } else if (reportOrder.includes(splittedMsg[1].toLowerCase())){//const reportOrder = ['reportinstalikes', 'reporttiktokcomments', 'reportstorysharing'];
                    if (splittedMsg[1].toLowerCase() === 'reportinstalikes') {
                        //Report Likes from Insta Official
                        //ClientName#reportinstalikes
                        response = await reportInstaLikes.reportInstaLikes(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }  

                    } else if (splittedMsg[1].toLowerCase() === 'reporttiktokcomments') {
                        //Report Comments from Tiktok Official
                        //ClientName#reporttiktokcomments
                        let response = await reportTiktokComments.reportTiktokComments(splittedMsg[0].toUpperCase());

                        if (response.code === 200){
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        } 
                    }
                } else if (unitTest.includes(splittedMsg[1].toLowerCase())){//const unitTest = ['createclient', 'pushclientuser', 'collectinstalikes', 'instalikesreport' , 'collecttiktokengagements', 'tiktokcommentsreport', 'swtest','crontestinsta', 'crontesttiktok' ];

                    // WA Order newClientName#createclient
                    if(splittedMsg[1].toLowerCase() === 'createclient'){


                        let response = await createClient.createClient(splittedMsg[0].toUpperCase(), splittedMsg[2].toUpperCase());

                        for (let i = 0; i < response.length; i++){

                            console.log(response[i].data);
                            client.sendMessage(msg.from, response[i].data);

                        }

                    // WA Order ClientName#pushclientuser#type['res', 'com']#spreadsheetsourcelink
                    } else if (splittedMsg[1].toLowerCase() === 'pushclientuser'){

                        console.log('Push User Client Triggered');

                        if (splittedMsg[3].includes('https://docs.google.com/spreadsheets/d/')){

                            console.log("Link True");

                            let response;
                        
                            console.log(splittedMsg[3].toUpperCase()+" Triggered");

                            response = await pushUserClient.pushUserClient(splittedMsg[0].toUpperCase(), splittedMsg[3], splittedMsg[2].toUpperCase());
                            
                            if (response.code === 200){
                                console.log(response.message);
                                client.sendMessage(msg.from, response.message);
                            } else {
                                console.log(response.message);
                            }                          
                        }

                    } else if (splittedMsg[1].toLowerCase() === 'collectinstalikes'){  
                        response = await collectInstaLikes.collectInstaLikes(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }  
                    } else if (splittedMsg[1].toLowerCase() === 'instalikesreport') {
                        //Report Likes from Insta Official
                        let response = await reportInstaLikes.reportInstaLikes(splittedMsg[0].toUpperCase());
                        
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        } 
                    } else if (splittedMsg[1].toLowerCase() === 'collecttiktokengagements'){  
                        response = await collectTiktokComments.collectTiktokComments(splittedMsg[0].toUpperCase());
                                    
                        if (response.code === 200){
                            console.log(response.data);
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.message);
                        }  
                    } else if (splittedMsg[1].toLowerCase() === 'tiktokcommentsreport') {
                        //Report Likes from Insta Official
                        let response = await reportTiktokComments.reportTiktokComments(splittedMsg[0].toUpperCase());
                        
                        if (response.code === 200){
                            client.sendMessage(msg.from, response.data);
                        } else {
                            console.log(response.data);
                        } 
                    } else if (splittedMsg[1].toLowerCase() === 'swtest') {

                        if (splittedMsg[2].includes('instagram.com')){

                            if (splittedMsg[2].includes('/p/') || splittedMsg[2].includes('/reels/') || splittedMsg[2].includes('/video/') ){
                               
                                let rawLink;
                                
                                if(splittedMsg[2].includes('/?')){
                                    rawLink = splittedMsg[2].replaceAll('/?', '?');
                                    shortcode = rawLink.split('?')[0].split('/').pop();
                                } else {
                                    shortcode = splittedMsg[2].split('/').pop();
                                }

                                console.log(shortcode);
                                                 
                                //Report Likes from Insta Official
                            
                                let response = await instaSW.instaSW(msg.from.replaceAll('@c.us', ''), shortcode);
                            
                                if (response.code === 200){
                                    console.log(response.data);
                                    client.sendMessage(msg.from, response.data);
                                } else {
                                    console.log(response.data);
                                } 
                            }
                        }
                    } else if (splittedMsg[1].toLowerCase() === 'crontestinsta') {

                        let response = await instaLoadClients.instaLoadClients('RES');

                        if (response.length >= 1){
                            for (let i = 0; i < response.length; i++){
                                await client.sendMessage(msg.from, response[i].data);
                            }
                        }           
                    } else if (splittedMsg[1].toLowerCase() === 'crontesttiktok') {

                        let response = await tiktokLoadClients.tiktokLoadClients('RES');

                        if (response.length >= 1){
                            for (let i = 0; i < response.length; i++){
                                await client.sendMessage(msg.from, response[i].data);
                            }
                        }           
                    } 
                    
                } else if (editdata.includes(splittedMsg[1].toLowerCase())){//const editdata = ['id_key', 'nama', 'title', 'jabatan', 'divisi', 'status'];
                        
                    //Report Likes from Insta Official
                    let response = await editProfile.editProfile(splittedMsg[0].toUpperCase(),splittedMsg[2].toLowerCase(), splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), splittedMsg[1].toUpperCase());
                    
                    if (response.code === 200){
                        console.log(response.data);
                        client.sendMessage(msg.from, response.data);
                    } else {
                        console.log(response.message);
                    }   
                
                } else if (updateUser.includes(splittedMsg[1].toLowerCase())){//const updateUser = ['updateinstausername','updatetiktokusername' ];

                    if (splittedMsg[1].toLowerCase() === 'updateinstausername') {
                        //Update Insta Profile
                        if (splittedMsg[3].includes('instagram.com')){

                            if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){

                                const instaLink = splittedMsg[3].split('?')[0];
    
                                const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  
                        
                                let response = await updateUsername.updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], instaUsername, 
                                msg.from.replace('@c.us', ''), splittedMsg[1].toLowerCase());
                            
                                if(response.code === 200){
                                    console.log(response.message);
                                    client.sendMessage(msg.from, response.message);
                                } else {
                                    console.log(response.message);
                                }                                   
                        
                            } else {
                                console.log('Bukan Link Profile Instagram');
                                client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                            }
                        
                        } else {
                            console.log('Bukan Link Profile Instagram');
                            client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                        }

                    } else if (splittedMsg[1].toLowerCase() === 'updatetiktokusername') {
                        //Update Insta Profile
                        if (splittedMsg[3].includes('tiktok.com')){

                            const tiktokLink = splittedMsg[3].split('?')[0];

                            const tiktokUsername = tiktokLink.split('/').pop();  
                    
                            let response = await updateUsername.updateUsername(splittedMsg[0].toUpperCase(), splittedMsg[2], tiktokUsername, 
                            msg.from.replace('@c.us', ''), splittedMsg[1].toLowerCase());
                        
                            if(response.code === 200){
                                console.log(response.message);
                                client.sendMessage(msg.from, response.message);
                            } else {
                                console.log(response.message);
                            }                                   
                    
                        } else {
                            console.log('Bukan Link Profile Instagram');
                            client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                        }                     
                    }
                }              
                //if(splittedMsg[1].toLowerCase()......
            } else {
                //Regular Messages
                const contact = await msg.getContact();
                //const chat = await msg.getChat();
                //chat.sendSeen();
                //chat.sendStateTyping();
                console.log(contact.number+" ===>>>> "+msg.body);
            } // if(splittedMsg.length....
        } //if(msg.status....
    } catch (error) {
        console.log(error); 
    }//try catch
});