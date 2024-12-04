'use client'
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  decryptDataAES,
  decryptDataDES,
  decryptRC4,
  decryptRC4_fileOnly,
} from '../utils/encryptionUtils';

interface FormValues {
  nama: string;
  description: string;
  decryptfile: FileList;
}

export const FileDownloadForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [algorithm, setAlgorithm] = useState('rc4');

  const readFile = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as ArrayBuffer);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  const onSubmit_decrypt: SubmitHandler<FormValues> = async (data) => {
    const file = data.decryptfile[0];
    const nama = data.nama;
    const description = data.description;

    try {
      const fileBlob = new Blob([file], {
        type: 'application/octet-stream',
      });
      const arrayBuffer = await readFile(file);
      const formData = {
        nama,
        description,
        file: fileBlob,
      };

      const secretKey = 'sec--key';
      let decryptedData;
      let decryptedDatas;

      // Choose decryption method based on selected algorithm
      if (algorithm === 'aes') {
        decryptedData = await decryptDataAES(formData, secretKey);

        if (!decryptedData) {
          throw new Error('Decryption failed or algorithm not recognized');
        }

        const decryptedBlob = new Blob([decryptedData.file], {
          type: 'application/octet-stream',
        });
        saveFile(decryptedBlob, file.name, 'decryptedFile');
      } else if (algorithm === 'des') {
        decryptedData = await decryptDataDES(formData, secretKey);

        if (!decryptedData) {
          throw new Error('Decryption failed or algorithm not recognized');
        }

        const decryptedBlob = new Blob([decryptedData.file], {
          type: 'application/octet-stream',
        });
        saveFile(decryptedBlob, file.name, 'decryptedFile');
      } else if (algorithm === 'rc4') {
        decryptedData = await decryptRC4(formData, secretKey);

        if (!decryptedData) {
          throw new Error('Decryption failed or algorithm not recognized');
        }

        const decryptedBlob = new Blob([decryptedData.file], {
          type: 'application/octet-stream',
        });
        saveFile(decryptedBlob, file.name, 'decryptedFile');
      } else if (algorithm === 'rc4_only') {
        decryptedDatas = await decryptRC4_fileOnly(fileBlob, secretKey);
        if (!decryptedDatas) {
          throw new Error('Decryption failed or algorithm not recognized');
        }
        const decryptedBlob = new Blob([decryptedDatas], {
          type: 'application/octet-stream',
        });
        saveFile(decryptedBlob, file.name, 'decryptedFile');
      }
    } catch (error) {
      console.error('Error decrypting file:', error);
    }
  };

  // Function to save the decrypted file
  const saveFile = (blob: Blob, filename: string, outputname: string) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';

    const url = window.URL.createObjectURL(blob);
    a.href = url;

    // Extract original file extension and use it
    const originalExtension = filename.split('.').pop();
    a.download = `${outputname}.${originalExtension}`;

    a.click();

    window.URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div
      style={{
        backgroundColor: '#a84d60',
        margin: '20px',
        padding: '20px',
        color: 'black',
      }}
    >
      <h2>Decrypt</h2>
      <form onSubmit={handleSubmit(onSubmit_decrypt)}>
        <input
          type='text'
          placeholder='Enter name'
          {...register('nama', { required: true })}
        />
        {errors.nama && <p>Name is required</p>}

        <textarea
          placeholder='Enter description'
          {...register('description', { required: true })}
        />
        {errors.description && <p>Description is required</p>}
        <input type='file' {...register('decryptfile', { required: true })} />
        {errors.decryptfile && <p>File is required</p>}

        <label>Select Decryption Algorithm:</label>
        <select onChange={(e) => setAlgorithm(e.target.value)}>
          <option value='aes'>AES</option>
          <option value='des'>DES</option>
          <option value='rc4'>RC4</option>
          <option value='rc4_only'>RC4</option>
        </select>

        <button type='submit'>Decrypt & Download</button>
      </form>
    </div>
  );
};

export default FileDownloadForm;
