export async function newListValueData(
    clientName, 
    keyValue
) {
    return new Promise(
        async (
            resolve
        ) => {

            let listValue = [];
        
            await readUser(clientName).then(
            data =>{
                    userRows = data;
                    
                    for (let i = 0; i < data.length; i++) {            
                        
                        if (!listValue.includes(data[i][keyValue])){
                            listValue.push(data[i][keyValue]); 

                        }
                        
                        resolve (listValue);
                    }
                    
                }
            )
        }
    );
}