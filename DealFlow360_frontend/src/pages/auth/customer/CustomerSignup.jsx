import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Mail, Phone, Globe, User, Briefcase, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { PasswordField } from '../../../components/ui/PasswordField';
import { PasswordStrength } from '../../../components/ui/PasswordStrength';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../../components/ui/SecondaryButton';
import { StepIndicator } from '../../../components/ui/StepIndicator';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { useAuth } from '../../../hooks/auth/useAuth';
import { usePasswordValidation } from '../../../hooks/auth/usePasswordValidation';

export const CustomerSignup = () => {
  const navigate = useNavigate();
  const { signupCustomer } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    businessEmail: '',
    phone: '',
    country: 'United States',
    fullName: '',
    jobTitle: '',
    contactEmail: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const { isValid: isPasswordValid } = usePasswordValidation(formData.password);

  const steps = [
    { id: 1, label: 'Business' },
    { id: 2, label: 'Contact' },
    { id: 3, label: 'Security' },
    { id: 4, label: 'Verify' },
  ];

  const updateForm = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.companyName.trim()) {
      setErrorMessage('Please enter your Company / Business Name.');
      return;
    }
    if (!formData.businessEmail.trim() || !formData.businessEmail.includes('@')) {
      setErrorMessage('Please enter a valid Business Email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide a contact Phone number.');
      return;
    }

    if (!formData.contactEmail) {
      updateForm({ contactEmail: formData.businessEmail });
    }

    setStep(2);
  };

  const handleStep2Next = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!formData.jobTitle.trim()) {
      setErrorMessage('Please specify your Job Title.');
      return;
    }
    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      setErrorMessage('Please enter a valid Contact Email address.');
      return;
    }

    setStep(3);
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isPasswordValid) {
      setErrorMessage('Password must satisfy all security requirements below.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!formData.agreedToTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await signupCustomer(formData);

      // Register self-signup customer in local storage for staff directory visibility
      try {
        const saved = JSON.parse(localStorage.getItem('dealflow360_customers') || '[]');
        const newCustomerRecord = {
          id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          companyName: formData.companyName,
          contactName: formData.fullName,
          email: formData.businessEmail,
          phone: formData.phone,
          taxId: 'TAX-PENDING',
          creditLimit: 10000,
          tier: 'Standard',
          totalOrdersAmount: 0,
          totalPurchasedUnits: 0,
          source: 'Self-Registered',
          status: 'Active',
          createdDate: new Date().toLocaleDateString(),
        };
        localStorage.setItem('dealflow360_customers', JSON.stringify([newCustomerRecord, ...saved]));
      } catch (e) {
        // ignore
      }

      setStep(4);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      portal="customer"
      title={step === 4 ? 'Verify Your Email' : 'Create Business Account'}
    >
      <StepIndicator steps={steps} currentStep={step} portal="customer" />

      {errorMessage && (
        <div className="mb-4">
          <AlertMessage
            variant="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleStep1Next}
            className="space-y-4"
          >
            <FormField
              label="Company / Business Name"
              required
              placeholder="e.g. Acme Global Logistics"
              value={formData.companyName}
              onChange={(e) => updateForm({ companyName: e.target.value })}
              icon={<Building2 className="w-4 h-4" />}
              portal="customer"
            />

            <FormField
              label="Business Email"
              type="email"
              required
              placeholder="purchasing@acmeglobal.com"
              value={formData.businessEmail}
              onChange={(e) => updateForm({ businessEmail: e.target.value })}
              icon={<Mail className="w-4 h-4" />}
              portal="customer"
              helperText="Official corporate email address"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Phone Number"
                type="tel"
                required
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => updateForm({ phone: e.target.value })}
                icon={<Phone className="w-4 h-4" />}
                portal="customer"
              />

              <div className="space-y-1 text-left">
                <label className="block text-[12px] sm:text-xs font-semibold text-slate-700 tracking-tight">
                  Country <span className="text-rose-500 font-extrabold">*</span>
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.country}
                    onChange={(e) => updateForm({ country: e.target.value })}
                    className="w-full h-10 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 font-medium transition-all duration-200"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <PrimaryButton
                type="submit"
                portal="customer"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Primary Contact
              </PrimaryButton>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleStep2Next}
            className="space-y-4"
          >
            <FormField
              label="Full Name"
              required
              placeholder="e.g. Sarah Connor"
              value={formData.fullName}
              onChange={(e) => updateForm({ fullName: e.target.value })}
              icon={<User className="w-4 h-4" />}
              portal="customer"
            />

            <FormField
              label="Job Title"
              required
              placeholder="e.g. Procurement Director"
              value={formData.jobTitle}
              onChange={(e) => updateForm({ jobTitle: e.target.value })}
              icon={<Briefcase className="w-4 h-4" />}
              portal="customer"
            />

            <FormField
              label="Contact Email"
              type="email"
              required
              placeholder="sarah.connor@acmeglobal.com"
              value={formData.contactEmail}
              onChange={(e) => updateForm({ contactEmail: e.target.value })}
              icon={<Mail className="w-4 h-4" />}
              portal="customer"
              helperText="Individual contact email for account notifications"
            />

            <div className="flex items-center gap-3 pt-3">
              <SecondaryButton
                type="button"
                portal="customer"
                onClick={() => setStep(1)}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                portal="customer"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Security
              </PrimaryButton>
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleStep3Submit}
            className="space-y-4"
          >
            <PasswordField
              label="Password"
              required
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => updateForm({ password: e.target.value })}
              portal="customer"
            />

            <PasswordStrength password={formData.password} />

            <PasswordField
              label="Confirm Password"
              required
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateForm({ confirmPassword: e.target.value })}
              portal="customer"
            />

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-left">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => updateForm({ agreedToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="text-xs text-slate-700 font-medium leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 underline font-semibold">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 underline font-semibold">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <SecondaryButton
                type="button"
                portal="customer"
                onClick={() => setStep(2)}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                portal="customer"
                isLoading={isLoading}
                loadingText="Creating Account..."
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                Create Account
              </PrimaryButton>
            </div>
          </motion.form>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Mail className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold font-heading text-slate-900">Check Your Inbox</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                We sent a verification link to:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-blue-200 font-mono text-sm text-blue-700 font-bold inline-block">
                {formData.businessEmail}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <PrimaryButton
                portal="customer"
                onClick={() => navigate('/c-entry-x9283f/login')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Customer Login
              </PrimaryButton>

              <SecondaryButton
                portal="customer"
                onClick={() => alert(`Verification email sent to ${formData.businessEmail}`)}
              >
                Resend Verification Email
              </SecondaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 4 && (
        <div className="pt-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-600 font-medium">
            Already registered?{' '}
            <Link
              to="/c-entry-x9283f/login"
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              Sign In to Portal
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
};
