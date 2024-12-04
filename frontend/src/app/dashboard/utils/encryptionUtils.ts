import CryptoJS from 'crypto-js';

interface EncryptedData {
  nama: string;
  description: string;
  file: Blob;
}

export async function encryptDataAES(
  data: { nama: string; description: string; file: ArrayBuffer },
  secretKey: string,
): Promise<EncryptedData> {
  // Enkripsi nama dan deskripsi
  const encryptedNama = CryptoJS.AES.encrypt(data.nama, secretKey).toString();
  const encryptedDescription = CryptoJS.AES.encrypt(
    data.description,
    secretKey,
  ).toString();

  // Enkripsi isi file
  const wordArray = CryptoJS.lib.WordArray.create(data.file);
  const encryptedFileContent = CryptoJS.AES.encrypt(
    wordArray,
    secretKey,
  ).toString();

  // Ubah string hasil enkripsi menjadi Blob
  const encryptedFileBlob = new Blob([encryptedFileContent], {
    type: 'application/octet-stream',
  });

  return {
    nama: encryptedNama,
    description: encryptedDescription,
    file: encryptedFileBlob,
  };
}

interface DecryptedData {
  nama: string;
  description: string;
  file: ArrayBuffer;
}

export async function decryptDataAES(
  encryptedData: EncryptedData,
  secretKey: string,
): Promise<DecryptedData> {
  // Decrypt nama and description
  const decryptedNama = CryptoJS.AES.decrypt(
    encryptedData.nama,
    secretKey,
  ).toString(CryptoJS.enc.Utf8);
  const decryptedDescription = CryptoJS.AES.decrypt(
    encryptedData.description,
    secretKey,
  ).toString(CryptoJS.enc.Utf8);

  // Decrypt file content
  const encryptedFileContent = await encryptedData.file.text();
  const decryptedFileContent = CryptoJS.AES.decrypt(
    encryptedFileContent,
    secretKey,
  );

  // Convert decrypted WordArray to Uint8Array
  const decryptedFileArrayBuffer = wordArrayToUint8Array(decryptedFileContent);

  return {
    nama: decryptedNama,
    description: decryptedDescription,
    file: decryptedFileArrayBuffer,
  };
}

interface EncryptedDataDES {
  nama: string;
  description: string;
  file: Blob;
}

// Encrypt data using DES
export async function encryptDataDES(
  data: { nama: string; description: string; file: ArrayBuffer },
  secretKey: string,
): Promise<EncryptedDataDES> {
  // Encrypt nama and description using DES
  const encryptedNama = CryptoJS.DES.encrypt(data.nama, secretKey).toString();
  const encryptedDescription = CryptoJS.DES.encrypt(
    data.description,
    secretKey,
  ).toString();

  // Encrypt file content
  const wordArray = CryptoJS.lib.WordArray.create(data.file);
  const encryptedFileContent = CryptoJS.DES.encrypt(
    wordArray,
    secretKey,
  ).toString();

  // Convert the encrypted string into a Blob
  const encryptedFileBlob = new Blob([encryptedFileContent], {
    type: 'application/octet-stream',
  });

  return {
    nama: encryptedNama,
    description: encryptedDescription,
    file: encryptedFileBlob,
  };
}

// Interface for the decrypted data
interface DecryptedDataDES {
  nama: string;
  description: string;
  file: ArrayBuffer;
}

// Decrypt data using DES
export async function decryptDataDES(
  encryptedData: EncryptedDataDES,
  secretKey: string,
): Promise<DecryptedDataDES> {
  // Decrypt nama and description using DES
  const decryptedNama = CryptoJS.DES.decrypt(
    encryptedData.nama,
    secretKey,
  ).toString(CryptoJS.enc.Utf8);
  const decryptedDescription = CryptoJS.DES.decrypt(
    encryptedData.description,
    secretKey,
  ).toString(CryptoJS.enc.Utf8);

  // Decrypt file content
  const encryptedFileContent = await encryptedData.file.text();
  const decryptedFileContent = CryptoJS.DES.decrypt(
    encryptedFileContent,
    secretKey,
  );

  // Convert decrypted WordArray to ArrayBuffer
  const decryptedFileArrayBuffer = wordArrayToUint8Array(decryptedFileContent);

  return {
    nama: decryptedNama,
    description: decryptedDescription,
    file: decryptedFileArrayBuffer,
  };
}

export async function encryptRC4(
  data: { nama: string; description: string; file: ArrayBuffer },
  secretKey: string,
): Promise<EncryptedData> {
  // Encrypt nama and description
  const encryptedNama = CryptoJS.RC4.encrypt(data.nama, secretKey).toString();
  const encryptedDescription = CryptoJS.RC4.encrypt(
    data.description,
    secretKey,
  ).toString();

  // Encrypt the file content (as binary data)
  const wordArray = CryptoJS.lib.WordArray.create(data.file);
  const encryptedFileContent = CryptoJS.RC4.encrypt(
    wordArray,
    secretKey,
  ).toString();

  // Convert the encrypted file content (Base64) back into a Blob
  const encryptedFileBlob = new Blob([encryptedFileContent], {
    type: 'application/octet-stream',
  });

  return {
    nama: encryptedNama,
    description: encryptedDescription,
    file: encryptedFileBlob,
  };
}

export async function decryptRC4(
  // encryptedData: { nama: string; description: string; file: Blob },
  encryptedData: EncryptedData,
  secretKey: string,
): Promise<DecryptedData> {
  // Enkripsi nama dan deskripsi
  const decryptedNama = CryptoJS.RC4.decrypt(
    encryptedData.nama,
    secretKey,
  ).toString(CryptoJS.enc.Utf8);
  const decryptedDescription = CryptoJS.RC4.decrypt(
    encryptedData.description,
    secretKey,
  ).toString(CryptoJS.enc.Utf8);

  // Enkripsi isi file
  const encryptedFileContent = await encryptedData.file.text();
  const decryptedFileContent = CryptoJS.RC4.decrypt(
    encryptedFileContent,
    secretKey,
  );

  const decryptedFileArrayBuffer = wordArrayToUint8Array(decryptedFileContent);

  return {
    nama: decryptedNama,
    description: decryptedDescription,
    file: decryptedFileArrayBuffer,
  };
}

export async function decryptRC4_fileOnly(
  // encryptedData: { nama: string; description: string; file: Blob },
  encryptedFile: Blob,
  secretKey: string,
): Promise<ArrayBuffer> {
  // Enkripsi isi file
  const encryptedFileContent = await encryptedFile.text();
  const decryptedFileContent = CryptoJS.RC4.decrypt(
    encryptedFileContent,
    secretKey,
  );

  const decryptedFileArrayBuffer = wordArrayToUint8Array(decryptedFileContent);

  return decryptedFileArrayBuffer;
}

// Helper function to convert a WordArray to Uint8Array
function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;

  const u8Array = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8Array[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  return u8Array.buffer; // Convert Uint8Array to ArrayBuffer
}
