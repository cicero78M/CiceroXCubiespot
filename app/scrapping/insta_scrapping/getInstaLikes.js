export async function getInstaLikes(todayItems) {

      const instaLikesUsernameDoc = new GoogleSpreadsheet(ciceroKey.dbKey.instaLikesUsernameID, googleAuth); //Google Authentication for instaLikes Username DB
    await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
    let instaLikesUsernameSheet = instaLikesUsernameDoc.sheetsByTitle[clientName];
    let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();

    var newData = 0;
    var updateData = 0;

    return new Promise(async (resolve, reject) => {

      for (let i = 0; i < todayItems.length; i++) {
        let hasShortcode = false;
        //code on the go
        for (let ii = 0; ii < instaLikesUsernameData.length; ii++) {
          if (instaLikesUsernameData[ii].get('SHORTCODE') === todayItems[i]) {
            hasShortcode = true;
      
            const fromRows = Object.values(instaLikesUsernameData[ii].toObject());
      
            const responseLikes = await instaLikesAPI(todayItems[i]);
            const likesItems = await responseLikes.data.data.items;
      
            let newDataUsers = [];
      
            for (let iii = 0; iii < fromRows.length; iii++) {
              if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                if (!newDataUsers.includes(fromRows[iii])) {
                  newDataUsers.push(fromRows[iii]);
                }
              }
            }
      
            for (let iii = 0; iii < likesItems.length; iii++) {
              if (likesItems[iii].username != undefined || likesItems[iii].username != null || likesItems[iii].username != "") {
                if (!newDataUsers.includes(likesItems[iii].username)) {
                  newDataUsers.push(likesItems[iii].username);
                }
              }
            }
      
            await instaLikesUsernameData[ii].delete();
            await instaLikesUsernameSheet.addRow(newDataUsers);
      
            console.log(`${clientName} Update Data ${todayItems[i]}`);
            await client.sendMessage('6281235114745@c.us', `${clientName} Update Data https://www.instagram.com/p/${todayItems[i]}`);
            
            updateData++;
          }
        }
        //Final Code
        if (!hasShortcode) {
          //If Shortcode doesn't exist push new data
          let responseLikes = await instaLikesAPI(todayItems[i]);
      
          let likesItems = await responseLikes.data.data.items;
          let userNameList = [todayItems[i]];
      
          for (let iii = 0; iii < likesItems.length; iii++) {
            if ('username' in likesItems[iii]) {
              userNameList.push(likesItems[iii].username);
            }
          }
          //Add new Row
          
          await instaLikesUsernameSheet.addRow(userNameList);
          newData++;
      
          console.log(`${clientName} Insert New Data ${todayItems[i]}`);
          await client.sendMessage('6281235114745@c.us', `${clientName} Insert New Data https://www.instagram.com/p/${todayItems[i]}`);
        }
      }
      
    })
}







