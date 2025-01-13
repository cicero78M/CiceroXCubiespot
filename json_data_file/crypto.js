import CryptoJS from "crypto-js"

export async function encrypted(data) {
    return new Promise((resolve, reject) => {
        try { 
            resolve (CryptoJS.AES.decrypt(data, process.env.SECRET_KEY).toString());
        } catch (error) {
            reject (error);
        }
    })
}