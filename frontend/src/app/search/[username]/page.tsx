'use client';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';
import withAuth from '@/lib/Auth/withAuth';
import Sidebar from '@/components/sidebar';
import SeekDataModal from './components/SeekDataModal';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';

interface Blog {
  id: number;
  account_id: number;
  description: string;
  nama: string;
  nama_file: string;
  file: string; // base64 encoded string
}

export default withAuth(SearchUserPage, 'auth');

function SearchUserPage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [isFollowed, setIsFollowed] = useState(false);

  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery<Blog[]>({
    queryKey: ['userBlogs', username],
    queryFn: async () => {
      const response = await api.get(`/auth/account/${username}/blogs`);
      if (response.data.success) {
        return response.data.data;
      } else {
        showToast(
          'Failed to load user blogs.',
          response.data.message || 'Failed to load user blogs.',
          'ERROR',
        );
        return [];
      }
    },
  });

  // Mutation to send friend request
  const { mutate: sendFriendRequest } = useMutation({
    mutationFn: async () => {
      const response = await api.post('/blog/request-friend', { username });
      if (response.data.success) {
        setIsFollowed(true);
        showToast(
          'Request sent',
          'Friend request sent successfully!',
          'SUCCESS',
        );
      } else {
        throw new Error(
          response.data.message || 'Failed to send friend request',
        );
      }
    },
    onError: (error: any) => {
      showToast(
        'Error',
        error.message || 'Failed to send friend request',
        'ERROR',
      );
    },
  });

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-64px)] w-full items-center justify-center'>
        <Typography variant='h1' className='text-gray-600'>
          Loading...
        </Typography>
      </div>
    );
  }

  if (isError || !blogs.length) {
    return (
      <div className='flex min-h-[calc(100vh-64px)] w-full items-center justify-center'>
        <Typography variant='h1' className='text-danger-normal'>
          User not found or no blogs available
        </Typography>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className='container mx-auto p-5'>
        <div className='profile flex items-center space-x-4'>
          <h1 className='text-2xl font-bold'>{username}</h1>
          <Button onClick={() => sendFriendRequest()} disabled={isFollowed}>
            {isFollowed ? 'Followed' : 'Request Follow'}
          </Button>
        </div>

        <div className='gallery mt-5 grid grid-cols-3 gap-4'>
          {blogs.map((item) => (
            <SeekDataModal blogId={item.id}>
              <Button
                key={item.id}
                className='card max-w-[300px] overflow-hidden rounded-lg bg-info-normal shadow-md'
              >
                <div className='p-4'>
                  <h3 className='text-center text-lg font-semibold'>
                    {item.nama}
                  </h3>
                </div>
              </Button>
            </SeekDataModal>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
