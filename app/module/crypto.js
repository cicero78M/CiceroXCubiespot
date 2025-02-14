import CryptoJS from "crypto-js"
//Encryptions
export function encrypted(data) {

    try {
        let encrypt = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
        return encrypt;
    } catch (error) {
        console.log(error)
    }

}
//Decryptions
export function decrypted(data) {
    try {
        let decrypt = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return decrypt;
    } catch (error) {
        console.log(error)
    }

}