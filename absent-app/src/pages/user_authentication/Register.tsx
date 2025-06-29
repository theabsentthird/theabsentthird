// src/pages/user_authentication/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Facebook } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiPost } from '@/utils/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8 || !/\d/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
      toast.error('Password must be at least 8 characters and include a number and a symbol.');
      setIsSubmitting(false);
      return;
    }

    try {
      await apiPost('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: accountType === 'business' ? 'business' : 'user',
        phoneNumber: '',
        profilePicture: '',
        bio: '',
      });

      const successMessage = accountType === 'personal' 
        ? '🎉 Account created! Please check your email to verify your account.'
        : '🎉 Registration submitted! Please verify your email first, then wait for admin approval.';
      
      toast.success(successMessage);
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create your {accountType} account
          </h1>

          {/* Account Type Selector */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setAccountType('personal')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                accountType === 'personal' 
                  ? 'bg-white shadow-sm font-medium text-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => setAccountType('business')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                accountType === 'business' 
                  ? 'bg-white shadow-sm font-medium text-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Business
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {accountType === 'personal' ? 'Full Name' : 'Contact Person'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder={accountType === 'personal' ? 'John Doe' : 'Your name'}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters with a number and symbol
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
              </div>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 px-4 rounded-lg hover:bg-[#166FE5] transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-medium text-primary hover:underline hover:text-primary-dark"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;