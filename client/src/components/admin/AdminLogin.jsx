import React, { useState, useEffect } from 'react';
import { Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';

export default function AdminLogin() {
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Add entrance animation after component mounts
    const timeout = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/admin_auth`;
      const { data: res } = await axios.post(url, data);
      localStorage.setItem('token', res.data);
      window.location = '/dashboard';
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout showBackButton>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className={`bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-8 transform transition-all duration-700 ease-out ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-[#4F46E5]/10 to-[#14B8A6]/10 rounded-full">
                <ShieldCheck className="h-8 w-8 text-[#4F46E5]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#14B8A6] bg-clip-text text-transparent font-['Poppins',sans-serif]">
              Welcome Back, Admin
            </h2>
            <p className="mt-2 text-[#6B7280] font-['Inter',sans-serif]">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              className={`space-y-4 transform transition-all delay-100 duration-700 ease-out ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800 font-['Inter',sans-serif] mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={data.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 font-['Inter',sans-serif]"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800 font-['Inter',sans-serif] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={data.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 font-['Inter',sans-serif]"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-sm text-[#4F46E5] hover:text-[#14B8A6] transition-colors font-['Inter',sans-serif]">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[#EF4444] bg-[#EF4444]/10 p-4 rounded-xl border border-[#EF4444]/20">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-['Inter',sans-serif]">{error}</p>
              </div>
            )}

            <div 
              className={`transform transition-all delay-200 duration-700 ease-out ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#14B8A6] hover:from-[#4338CA] hover:to-[#0D9488] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] transition-all duration-200 shadow-lg shadow-[#4F46E5]/25 disabled:opacity-70 disabled:cursor-not-allowed font-['Inter',sans-serif]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="mt-8 text-center text-sm text-[#6B7280] font-['Inter',sans-serif]">
                <p>Need assistance? <a href="#" className="text-[#4F46E5] hover:text-[#14B8A6] transition-colors">Contact Support</a></p>
              </div>
            </div>
          </form>
        </div>
        
        <div 
          className={`mt-8 text-center transition-all delay-300 duration-700 ease-out ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex justify-center space-x-6">
            {['Security Policy', 'Terms of Service', 'Privacy Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-[#6B7280] hover:text-[#4F46E5] transition-colors font-['Inter',sans-serif]">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}