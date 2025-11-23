import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SignInModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignup) await signup(email, password);
      else await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-4">{isSignup ? 'Sign up' : 'Sign in'}</h3>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-medium"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
            <button
              type="button"
              className="text-sm text-gray-300 underline"
              onClick={() => setIsSignup((s) => !s)}
            >
              {isSignup ? 'Have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-right">
          <button
            className="text-sm text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
