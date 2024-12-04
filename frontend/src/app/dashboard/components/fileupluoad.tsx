'use client'
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  encryptDataAES,
  decryptDataAES,
  encryptDataDES,
  decryptDataDES,
  encryptRC4,
  decryptRC4,
} from '../utils/encryptionUtils';

interface FormValues {
  nama: string;
  description: string;
  encryptfile: FileList;
}

export const FileUploadForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [algorithm, setAlgorithm] = useState('rc4');

  // Function to read the file as an ArrayBuffer
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

  // Handler for form submit
  const onSubmit_encrypt: SubmitHandler<FormValues> = async (data) => {
    const file = data.encryptfile[0];
    const nama = data.nama;
    const description = data.description;

    try {
      const arrayBuffer = await readFile(file);
      const formData = {
        nama,
        description,
        file: arrayBuffer,
      };

      const secretKey = 'sec--key';
      var encryptedData;

      // Choose encryption method based on selected algorithm
      if (algorithm === 'aes') {
        encryptedData = await encryptDataAES(formData, secretKey);
      } else if (algorithm === 'des') {
        encryptedData = await encryptDataDES(formData, secretKey);
      } else if (algorithm === 'rc4') {
        encryptedData = await encryptRC4(formData, secretKey);
      }

      if (!encryptedData || !encryptedData.file) {
        throw new Error('Encryption failed or algorithm not recognized');
      }

      saveFile(encryptedData.file, file.name, 'encryptedFile');

      const uploadformData = {
        nama,
        description,
        nama_file: file.name,
        file: encryptedData.file.toString(), // Send encrypted file as base64
        account_id: '1', // Example account_id, replace with actual account ID
      };

      // Send the encrypted data to the backend
      const response = await fetch('/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadformData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error encrypting file:', error);
    }
  };

  // Function to save the encrypted file as a download
  const saveFile = (blob: Blob, filename: string, outputname: string) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';

    const url = window.URL.createObjectURL(blob);
    a.href = url;

    // Extract file extension from original filename
    const originalExtension = filename.split('.').pop();
    a.download = `${outputname}.${originalExtension}`;

    a.click();

    window.URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div
      style={{
        backgroundColor: '#4ca69d',
        margin: '20px',
        padding: '20px',
        color: 'black',
      }}
    >
      <h2>Encrypt</h2>
      <form onSubmit={handleSubmit(onSubmit_encrypt)}>
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

        <input type='file' {...register('encryptfile', { required: true })} />
        {errors.encryptfile && <p>File is required</p>}

        <label>Select Encryption Algorithm:</label>
        <select onChange={(e) => setAlgorithm(e.target.value)}>
          <option value='aes'>AES</option>
          <option value='des'>DES</option>
          <option value='rc4'>RC4</option>
        </select>

        <button type='submit'>Encrypt & Download</button>
      </form>
    </div>
  );
};

export default FileUploadForm;
