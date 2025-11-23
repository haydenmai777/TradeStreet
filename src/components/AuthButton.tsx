import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SignInModal from './SignInModal';

export const AuthButton: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-300">{user.email}</div>
        <button
          className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm"
          onClick={() => logout()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded font-medium text-sm"
        onClick={() => setOpen(true)}
      >
        Sign in
      </button>
      <SignInModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AuthButton;
