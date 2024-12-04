'use client'
import React, { useState, useMemo, useEffect } from 'react';
import NextImage from '@/components/NextImage';
import AddDataModal from './components/TambahDataModal';
import ApprovalRequestModal from './components/ApprovalRequest';
import withAuth from '@/lib/Auth/withAuth';
import SearchInput from '@/components/searchInput';
import Fuse from 'fuse.js';
import Sidebar from '@/components/sidebar';
import api from '@/lib/api'; // Import the API utility
import { showToast } from '@/components/Toast'; // Import toast for showing errors

interface BlogData {
  account_id: number;
  description: string;
  file: string;
  id: number;
  nama: string;
  nama_file: string;
}

interface Item {
  image: string;
  nama: string;
  deskripsi: string;
}

export default withAuth(Dashboardage, 'auth');

function Dashboardage() {
  const [data, setData] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from the `/blog` API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/blog/');
        const { data: blogData, success, message } = response.data;

        if (success) {
          const formattedData = blogData.map((blog: BlogData) => ({
            image: `data:image/png;base64,${blog.file}`, // Use base64 encoded file data
            nama: blog.nama,
            deskripsi: blog.description,
          }));
          setData(formattedData);
        } else {
          showToast('Failed to load blogs', message, 'ERROR');
        }
      } catch (error) {
        showToast(
          'Error',
          'Failed to load blog data. Please try again later.',
          'ERROR',
        );
        console.error('Error fetching blog data:', error);
      }
    };

    fetchData();
  }, []);

  // Fuse.js for searching
  const fuse = new Fuse<Item>(data, {
    keys: ['nama', 'deskripsi'],
    includeScore: true,
    threshold: 0.3,
  });

  // Filtering data based on search term
  const filteredData = useMemo(() => {
    if (searchTerm) {
      const results = fuse.search(searchTerm);
      return results.map((result) => result.item);
    }
    return data;
  }, [searchTerm, data]);

  return (
    <Sidebar>
      <main className='p-5'>
        <div className='mt-1 flex justify-between max-md:flex-col max-md:gap-4'>
          <AddDataModal />
          <ApprovalRequestModal />
          <SearchInput
            input={searchTerm}
            setInput={setSearchTerm}
            className='md:max-w-[300px]'
          />
        </div>
        <div className='mt-8 flex flex-wrap justify-center gap-5'>
          {filteredData.map((item, index) => (
            <div
              key={index}
              className='card max-w-[300px] overflow-hidden rounded-lg bg-white shadow-md'
            >
              <img
                width={360}
                height={237}
                src={item.image}
                alt={item.nama}
                className='h-48 w-full object-cover'
              />
              <div className='p-4'>
                <h3 className='text-lg font-semibold'>{item.nama}</h3>
                <p className='text-gray-600'>{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Sidebar>
  );
}
