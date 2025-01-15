import CryptoJS from "crypto-js"

export function encrypted(data) {
    let encrypt = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
    return encrypt;
}

export function decrypted(data) {
    let decrypt = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decrypt;
}