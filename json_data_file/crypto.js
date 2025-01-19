import CryptoJS from "crypto-js"
//Encryptions
export function encrypted(data) {
    let encrypt = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
    return encrypt;
}
//Decryptions
export function decrypted(data) {
    let decrypt = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decrypt;
}