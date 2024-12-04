'use client';
import React, { useState, useEffect } from 'react';
import { KeyRound, Check, Trash2 } from 'lucide-react';
import withAuth from '@/lib/Auth/withAuth';
import Sidebar from '@/components/sidebar';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';
import PDFSignatureModal from './components/PdfSignatureModal';
import Typography from '@/components/Typography';
import IconButton from '@/components/buttons/IconButton';
import VerifyModal from './components/VerifyModal';

export default withAuth(PrivatePage, 'auth');

function PrivatePage() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null); // State to track verification status
  const [loading, setLoading] = useState<boolean>(true); // State for loading status

  useEffect(() => {
    const checkSignatureStatus = async () => {
      try {
        setLoading(true);

        // Call the API to check the signature status
        const response = await api.get('/pdf-signature/is-have-signature');
        const isHaveSignature = response.data?.data?.isHaveSignature;
        console.log(isHaveSignature);
        if (isHaveSignature) {
          setIsVerified(true);
          showToast('Success', 'Your account is verified.', 'SUCCESS');
        } else {
          setIsVerified(false);
          showToast('Info', 'No signature found for your account.', 'INFO');
        }
      } catch (error) {
        setIsVerified(false);
        showToast('Error', 'Failed to check signature status.', 'ERROR');
      } finally {
        setLoading(false);
      }
    };

    checkSignatureStatus();
  }, []);

  const handleDeleteSignature = async () => {
    try {
      setLoading(true);
      const response = await api.delete('/pdf-signature/delete');
      console.log(response);
      if (response.status === 200) {
        setIsVerified(false);
        showToast('Success', 'Signature deleted successfully.', 'SUCCESS');
      } else {
        showToast('Error', 'Failed to delete signature.', 'ERROR');
      }
    } catch (error) {
      showToast('Error', 'Failed to delete signature.', 'ERROR');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <main className='flex h-full w-full items-center justify-center p-5'>
        <div className='flex flex-col items-center justify-center gap-4'>
          {!isVerified ? (
            <KeyRound size={160} color='#000000' />
          ) : (
            <Check size={160} color='#44a96d' />
          )}

          {loading ? (
            <Typography className='text-lg font-semibold text-gray-600'>
              Checking signature status...
            </Typography>
          ) : isVerified ? (
            <div className='flex items-center gap-4'>
              <VerifyModal/>
              <Typography
                className='text-lg font-bold text-green-600'
                variant='h1'
              >
                Verified
              </Typography>
              <IconButton
                variant='danger'
                Icon={Trash2}
                className='h-10'
                onClick={handleDeleteSignature} // Attach the handler to the button
              />
            </div>
          ) : (
            <PDFSignatureModal
              isVerified={isVerified}
              setIsVerified={setIsVerified}
            />
          )}
        </div>
      </main>
    </Sidebar>
  );
}
