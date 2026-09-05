import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';

/**
 * Reusable NotFound (404) Component
 */
export const NotFound = ({
  title = 'Page Not Found',
  description = "The page you're looking for doesn't exist, has been removed, or is temporarily unavailable.",
  onReturn,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      navigate('/company/dashboard');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-16 text-center max-w-lg mx-auto ${className}`}>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#F7F2F5] text-[#714B67] flex items-center justify-center mb-6 border border-[#714B67]/20 shadow-sm">
        <FileQuestion className="w-9 h-9 stroke-[1.5]" />
      </div>
      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
        Error 404 • Not Found
      </span>
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mb-2">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-8">
        {description}
      </p>
      <Button
        variant="primary"
        size="md"
        leadingIcon={ArrowLeft}
        onClick={handleReturn}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
