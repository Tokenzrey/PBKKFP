import CryptoJS from 'crypto-js';

const encryptData = (data: string): string => {
  const key = CryptoJS.enc.Utf8.parse('12345678'); // DES uses an 8-byte key
  const iv = CryptoJS.enc.Utf8.parse('12345678'); // 8-byte IV for CBC mode

  // Encrypt the data
  const encrypted = CryptoJS.DES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export { encryptData };