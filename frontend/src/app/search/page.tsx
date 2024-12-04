'use client';
import React, { useState, useMemo } from 'react';
import SearchInput from '@/components/searchInput';
import UserLink from './components/UserLinkButton';
import Typography from '@/components/Typography';
import withAuth from '@/lib/Auth/withAuth';
import Sidebar from '@/components/sidebar';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';
import { AxiosError } from 'axios';
import Fuse from 'fuse.js';

export interface User {
  id: number;
  name: string;
}

export default withAuth(SearchPage, 'auth');
function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users from API
  const {
    data: users = [], // Set default to empty array here
    isLoading,
    isError,
  } = useQuery<User[], AxiosError>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/auth/accounts');
      if (response.data.success) {
        return response.data.data;
      } else {
        showToast(
          'Failed to load users.',
          response.data.message || 'Failed to load users.',
          'ERROR',
        );
        return [];
      }
    },
  });

  // Setup Fuse.js with options for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(users, {
      keys: ['name'], // Searchable fields
      includeScore: true, // Include score for better match control
      threshold: 0.3, // Adjust threshold for sensitivity of the match
    });
  }, [users]);

  // Filter users based on search term using Fuse.js
  const filteredUsers = useMemo(() => {
    if (searchTerm.trim().length === 0) return users;

    const results = fuse.search(searchTerm);
    return results.map((result) => result.item);
  }, [searchTerm, users, fuse]);

  if (isLoading) {
    return (
      <Sidebar>
        <div className='flex min-h-[calc(100vh-64px)] items-center justify-center'>
          <Typography variant='h1' className='text-gray-600'>
            Loading...
          </Typography>
        </div>
      </Sidebar>
    );
  }

  if (isError) {
    return (
      <Sidebar>
        <div className='flex min-h-[calc(100vh-64px)] items-center justify-center'>
          <Typography variant='h1' className='text-red-600'>
            Error loading users. Please try again.
          </Typography>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className='min-h-[calc(100vh-64px)] p-5'>
        <SearchInput
          input={searchTerm}
          setInput={setSearchTerm}
          placeholder='Search users...'
        />

        <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: User) => (
              <UserLink key={user.id} user={user} />
            ))
          ) : (
            <Typography variant='h1' className='text-gray-600'>
              No users found.
            </Typography>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
