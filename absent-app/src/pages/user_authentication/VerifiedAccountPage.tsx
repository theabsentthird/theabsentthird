import { CheckCircle } from 'lucide-react';

const VerifiedAccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          
          <h1 className="mt-3 text-2xl font-bold text-gray-800">Account Verified!</h1>
          
          <p className="mt-2 text-gray-600">
            Your account has been successfully verified. You can now access all features.
          </p>
          
          <div className="mt-6">
            <a
              href="/"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Continue to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedAccountPage;