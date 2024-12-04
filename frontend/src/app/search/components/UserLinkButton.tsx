// UserCard.tsx
import React from 'react';
import ButtonLink from '@/components/links/ButtonLink'; 
import { User } from '../page'; 

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <ButtonLink
      href={`/search/${encodeURIComponent(user.name)}`}
      variant='warning'
      appearance='normal'
      size='medium'
      openNewTab={false}
    >
      <div className='flex items-center space-x-3'>
        <div>
          <h3 className='text-lg font-semibold'>{user.name}</h3>
        </div>
      </div>
    </ButtonLink>
  );
};

export default UserCard;
