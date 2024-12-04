'use client';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/dialog';
import SearchInput from '@/components/searchInput';
import Button from '@/components/buttons/Button';
import { Check, X } from 'lucide-react';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';
import IconButton from '@/components/buttons/IconButton';

interface FollowRequest {
  id: string;
  sender_id: number;
  sender_username: string;
  encrypted_key: string;
  is_approved: boolean;
  created_at: string;
}

export default function ApprovalRequestModal() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch received follow requests from API
  const { data: requests = [], refetch } = useQuery<FollowRequest[]>({
    queryKey: ['receivedFriendRequests'],
    queryFn: async () => {
      const response = await api.get('/blog/received-friend');
      if (response.data.success) {
        return response.data.data;
      } else {
        showToast(
          'Failed to load friend requests.',
          response.data.message || 'Failed to load friend requests.',
          'ERROR',
        );
        return [];
      }
    },
  });

  // Mutation to approve a friend request
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(`/blog/approve-request/${id}`);
      if (response.data.success) {
        showToast(
          'Request Approved',
          'Friend request approved successfully!',
          'SUCCESS',
        );
        refetch();
      } else {
        throw new Error(
          response.data.message || 'Failed to approve friend request',
        );
      }
    },
  });

  // Mutation to decline a friend request
  const declineMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/blog/delete-request-friend/${id}`);
      if (response.data.success) {
        showToast(
          'Request Declined',
          'Friend request declined successfully!',
          'SUCCESS',
        );
        refetch();
      } else {
        throw new Error(
          response.data.message || 'Failed to decline friend request',
        );
      }
    },
  });

  // Filter requests based on the search term
  const filteredRequests = requests.filter((request) =>
    request.sender_username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant='info'>Follow Requests</Button>
      </ModalTrigger>
      <ModalContent aria-label='Follow Requests'>
        <ModalHeader>
          <ModalTitle>Follow Requests</ModalTitle>
        </ModalHeader>
        <ModalDescription>
          <SearchInput
            input={searchTerm}
            setInput={setSearchTerm}
            placeholder='Search requests...'
            className='mb-4'
          />
          <div className='space-y-4'>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className='flex items-center justify-between border-b py-2'
                >
                  <p className='text-lg'>{request.sender_username}</p>
                  <div className='flex gap-2'>
                    {!request.is_approved ? (
                      <IconButton
                        variant='success'
                        appearance='light'
                        size='small'
                        onClick={() => approveMutation.mutate(request.id)}
                        Icon={Check}
                      />
                    ) : (
                      <Button
                        appearance='light'
                        size='small'
                        onClick={() => {
                          navigator.clipboard.writeText(request.encrypted_key);
                          showToast(
                            'Copied',
                            'Encrypted key copied to clipboard',
                            'SUCCESS',
                          );
                        }}
                      >
                        Copy Key
                      </Button>
                    )}
                    <IconButton
                      variant='danger'
                      appearance='light'
                      size='small'
                      onClick={() => declineMutation.mutate(request.id)}
                      Icon={X}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No follow requests found.</p>
            )}
          </div>
        </ModalDescription>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant='danger'>Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
