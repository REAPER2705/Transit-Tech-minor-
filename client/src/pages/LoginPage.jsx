import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithMockUser, setError, error, isLoading } = authStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoLogin = (userType) => {
    const user = loginWithMockUser(userType);
    if (user) {
      if (userType === 'admin') {
        navigate('/admin');
      } else if (userType === 'staff') {
        navigate('/staff');
      } else {
        navigate('/passenger');
      }
    } else {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-600 text-white p-3 rounded-lg mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.312 5.406l.008.896l-15.04.002c.162-1.6.854-3.195 1.988-4.231L5.4 1l1.988 5.406h12.924zm0 13.188l-.008-.896l15.04-.002c-.162 1.6-.854 3.195-1.988 4.231l.87 1.072-1.988-5.406H5.388z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">TransitTech</h1>
            <p className="text-gray-600">Smart Campus Transport</p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {error}
            </div>
          )}

          <div className="border-t pt-6">
            <p className="text-center text-sm text-gray-700 mb-4 font-medium">Select Your Role</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('passenger')}
                disabled={isLoading}
                className="btn-secondary w-full text-sm font-medium"
              >
                👤 Passenger Portal
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('staff')}
                disabled={isLoading}
                className="btn-secondary w-full text-sm font-medium"
              >
                🚗 Transport Staff Portal
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="btn-secondary w-full text-sm font-medium"
              >
                ⚙️ Admin Portal
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6">
          © 2025 AITR Campus Transit. All rights reserved.
        </p>
      </div>
    </div>
  );
}