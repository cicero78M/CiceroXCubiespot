const express = require('express');
const app = express();

var dataBase = require('./database/database');
var query = require('./database/query');

const { Client , LocalAuth } = require('whatsapp-web.js');
const figlet = require('figlet');
const banner = require('simple-banner');
const qrcode = require('qrcode-terminal');

const port = 3007;
const databaseID = '1gwXv8rHNgX16qbDqht_OPh0pbQI5jl1WjWZz3yrcSf8';

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "Client_Name",
    }),
});

//initialize 
client.initialize();

client.on('authenthicated', (session)=>{

    console.log(session);
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log(figlet.textSync("CICERO -X- CUBIES", {
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
});

client.on('qr', qr => {
    //Pairing WA Center
    qrcode.generate(qr, {small: true});
});

client.on('message', async (msg) => {

    const newClientOrder = ['newclientorg', 'newclientcom'];
    const updateUserData = ['adduser', 'editnama', 'editdivisi', 'editjabatan', 'updateinsta', 'updatetiktok'];
    const reloadOrder = ['instareload', 'tiktokreload', 'storyreload'];
    const reportOrder = ['instareport', 'tiktokreport', 'storyreport'];

    try {
        if (msg.isStatus){
            //If Msg is WA Story
            console.log(msg.body);
        } else {
            //Splitted Msg
            const splittedMsg = msg.body.split("#");
            if(splittedMsg.length > 1){
                console.log(msg.from);
                if(newClientOrder.includes(splittedMsg[1].toLowerCase())){
                //Admin Order
                    if(splittedMsg[2].includes('https://docs.google.com/spreadsheets/d/')){
                        //Is contains Links
                        if (splittedMsg[1].toLowerCase() === "newclientorg"){
                            //If Request for New Client by Organizations
                            try {
                            //Organizations Request
                                let response = await dataBase.newClientOrg(splittedMsg[0].toUpperCase(), splittedMsg[2], databaseID);
                                client.sendMessage(msg.from, response);

                            } catch (error) {
                                console.log(error);
                            }                    
                        }  else if (splittedMsg[1].toLowerCase() === "newclientcom"){
                            //If Request for New Client by Company
                            try {
                            //Company Request
                                let response = await dataBase.newClientCom(splittedMsg[0].toUpperCase(), splittedMsg[2], databaseID);
                                client.sendMessage(msg.from, response);

                            } catch (error) {
                                console.log(error);
                            }                                         
                        }
                    } else {
                        console.log('Bukan Spreadsheet Links');
                    }                
                } else if (updateUserData.includes(splittedMsg[1].toLowerCase())){
                    //User Update Data
                    if (splittedMsg[1].toLowerCase() === 'adduser'){ 
                        //Check Between Corporate And Organizations
                        if(splittedMsg.length > 6){                   
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), splittedMsg[6].toUpperCase(), databaseID);
                            client.sendMessage(msg.from, response);
                        } else {
                            let response = await dataBase.addUser(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), splittedMsg[4].toUpperCase(), splittedMsg[5].toUpperCase(), null, databaseID);
                            client.sendMessage(msg.from, response);
                        }
                    } else if(splittedMsg[1].toLowerCase() === 'editdivisi') {
                        let response = await dataBase.editDivisi(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), databaseID);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'editjabatan') {
                        let response = await dataBase.editJabatan(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), databaseID);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'editnama') {
                        let response = await dataBase.editNama(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3].toUpperCase(), msg.from.replace('@c.us', ''), databaseID);
                        client.sendMessage(msg.from, response);
                    } else if(splittedMsg[1].toLowerCase() === 'updateinsta') {
                        if (splittedMsg[3].includes('instagram.com')){
                            if (!splittedMsg[3].includes('/p/') || !splittedMsg[3].includes('/reels/') || !splittedMsg[3].includes('/video/') ){
                                let response = await dataBase.updateInsta(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3], msg.from.replace('@c.us', ''), databaseID);
                                client.sendMessage(msg.from, response);
                            } else {
                                client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                            }
                        } else {
                            client.sendMessage(msg.from, 'Bukan Link Profile Instagram');
                        }
                    } else if(splittedMsg[1].toLowerCase() === 'updatetiktok') {
                        if (splittedMsg[3].includes('tiktok.com')){                    
                            let response = await dataBase.updateTiktok(splittedMsg[0].toUpperCase(), splittedMsg[2], splittedMsg[3],msg.from.replace('@c.us', ''), databaseID);
                            client.sendMessage(msg.from, response);
                        } else {
                            client.sendMessage(msg.from, 'Bukan Link Profile Tiktok');
                        }
                    }
                } else if(splittedMsg[1].toLowerCase() === 'mydata'){
                
                    let response = await query.myData(splittedMsg[0].toUpperCase(), splittedMsg[2] ,msg.from.replace('@c.us', ''), databaseID);
                    client.sendMessage(msg.from, response);
                }


            } else {
                console.log('Reqular Messages');
            }
        }
    } catch (error) {
        console.log(error);
    }
});