import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  User,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { FormField } from '../../components/ui/FormField';
import { PasswordField } from '../../components/ui/PasswordField';
import { PasswordStrength } from '../../components/ui/PasswordStrength';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { AlertMessage } from '../../components/ui/AlertMessage';
import { SocialLoginButtons } from '../../components/ui/SocialLoginButtons';
import { useAuth } from '../../hooks/auth/useAuth';
import { usePasswordValidation } from '../../hooks/auth/usePasswordValidation';

export const UnifiedAuth = () => {
  const navigate = useNavigate();
  const { login, signupCustomer } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // ==========================================
  // LOGIN STATE (CLEAN INITIAL INPUTS)
  // ==========================================
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // ==========================================
  // MULTI-STEP CUSTOMER SIGNUP STATE
  // ==========================================
  const [signupStep, setSignupStep] = useState(1);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [signupError, setSignupError] = useState(null);

  const [signupForm, setSignupForm] = useState({
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

  const { isValid: isPasswordValid } = usePasswordValidation(signupForm.password);

  const signupSteps = [
    { id: 1, label: 'Business' },
    { id: 2, label: 'Contact' },
    { id: 3, label: 'Security' },
    { id: 4, label: 'Verify' },
  ];

  const updateSignupForm = (fields) => {
    setSignupForm((prev) => ({ ...prev, ...fields }));
  };

  // ------------------------------------------
  // LOGIN SUBMIT HANDLER
  // ------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter your email address and password.');
      return;
    }

    setIsLoginSubmitting(true);
    try {
      const user = await login(loginEmail, loginPassword);

      // Smart Role-Based Redirection
      if (user) {
        if (user.portal === 'customer' || user.role === 'Customer' || user.role === 'CUSTOMER') {
          navigate('/customer/dashboard');
        } else {
          navigate('/company/dashboard');
        }
      }
    } catch (err) {
      if (err.code === 'MFA_REQUIRED') {
        navigate('/m-entry-z7829a/mfa');
      } else {
        setLoginError(err.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  // ------------------------------------------
  // MULTI-STEP SIGNUP HANDLERS
  // ------------------------------------------
  const handleSignupStep1Next = (e) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupForm.companyName.trim()) {
      setSignupError('Please enter your Company / Business Name.');
      return;
    }
    if (!signupForm.businessEmail.trim() || !signupForm.businessEmail.includes('@')) {
      setSignupError('Please enter a valid Business Email address.');
      return;
    }
    if (!signupForm.phone.trim()) {
      setSignupError('Please provide a contact Phone number.');
      return;
    }

    if (!signupForm.contactEmail) {
      updateSignupForm({ contactEmail: signupForm.businessEmail });
    }

    setSignupStep(2);
  };

  const handleSignupStep2Next = (e) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupForm.fullName.trim()) {
      setSignupError('Please enter your Full Name.');
      return;
    }
    if (!signupForm.jobTitle.trim()) {
      setSignupError('Please specify your Job Title.');
      return;
    }
    if (!signupForm.contactEmail.trim() || !signupForm.contactEmail.includes('@')) {
      setSignupError('Please enter a valid Contact Email address.');
      return;
    }

    setSignupStep(3);
  };

  const handleSignupStep3Submit = async (e) => {
    e.preventDefault();
    setSignupError(null);

    if (!isPasswordValid) {
      setSignupError('Password must satisfy all security requirements below.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (!signupForm.agreedToTerms) {
      setSignupError('You must agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setIsSignupSubmitting(true);
    try {
      await signupCustomer({
        companyName: signupForm.companyName,
        businessEmail: signupForm.businessEmail,
        phone: signupForm.phone,
        country: signupForm.country,
        fullName: signupForm.fullName,
        jobTitle: signupForm.jobTitle,
        contactEmail: signupForm.contactEmail,
        password: signupForm.password,
      });

      setSignupStep(4);
    } catch (err) {
      setSignupError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSignupSubmitting(false);
    }
  };

  const handleSocialSSO = (method) => {
    alert(`Initiating ${method} Single Sign-On flow...`);
  };

  return (
    <AuthLayout
      portal="unified"
      title={
        mode === 'login'
          ? 'DealFlow360 Platform'
          : signupStep === 4
          ? 'Verify Your Email'
          : 'Create Business Account'
      }
      subtitle="Enterprise Sales Operations & Client Portal"
    >
      <div className="space-y-6">
        {/* VIEW 1: SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            {loginError && (
              <AlertMessage
                variant="error"
                message={loginError}
                onDismiss={() => setLoginError(null)}
              />
            )}

            <FormField
              label="Email Address"
              type="email"
              required
              placeholder="name@company.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              portal="company"
              autoComplete="email"
            />

            <div className="space-y-1">
              <PasswordField
                label="Password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                portal="company"
                autoComplete="current-password"
              />
              <div className="flex justify-end pt-0.5">
                <Link
                  to="/m-entry-z7829a/forgot-password"
                  className="text-xs text-[#714B67] hover:text-purple-900 font-bold hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <PrimaryButton
              type="submit"
              portal="company"
              isLoading={isLoginSubmitting}
              loadingText="Authenticating Access..."
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </PrimaryButton>

            <SocialLoginButtons portal="company" onSelectMethod={handleSocialSSO} />

            {/* Bottom Text Link for Customer Registration */}
            <div className="pt-3 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-600 font-medium">
                New account required?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setSignupStep(1);
                    setSignupError(null);
                  }}
                  className="text-[#714B67] hover:text-purple-900 font-bold hover:underline transition-colors cursor-pointer"
                >
                  Create Business Account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* VIEW 2: MULTI-STEP CUSTOMER SIGNUP */}
        {mode === 'signup' && (
          <div className="space-y-4 text-left">
            <StepIndicator steps={signupSteps} currentStep={signupStep} portal="company" />

            {signupError && (
              <AlertMessage
                variant="error"
                message={signupError}
                onDismiss={() => setSignupError(null)}
              />
            )}

            <AnimatePresence mode="wait">
              {/* Step 1: Business Details */}
              {signupStep === 1 && (
                <motion.form
                  key="signupStep1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignupStep1Next}
                  className="space-y-4"
                >
                  <FormField
                    label="Company / Business Name"
                    required
                    placeholder="e.g. Acme Global Logistics"
                    value={signupForm.companyName}
                    onChange={(e) => updateSignupForm({ companyName: e.target.value })}
                    icon={<Building2 className="w-4 h-4" />}
                    portal="company"
                  />

                  <FormField
                    label="Business Email"
                    type="email"
                    required
                    placeholder="purchasing@acmeglobal.com"
                    value={signupForm.businessEmail}
                    onChange={(e) => updateSignupForm({ businessEmail: e.target.value })}
                    icon={<Mail className="w-4 h-4" />}
                    portal="company"
                    helperText="Official corporate email address"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Phone Number"
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={signupForm.phone}
                      onChange={(e) => updateSignupForm({ phone: e.target.value })}
                      icon={<Phone className="w-4 h-4" />}
                      portal="company"
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
                          value={signupForm.country}
                          onChange={(e) => updateSignupForm({ country: e.target.value })}
                          className="w-full h-10 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-slate-900 bg-white border border-slate-300/90 rounded-xl focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/15 font-medium transition-all duration-200"
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
                      portal="company"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Primary Contact
                    </PrimaryButton>
                  </div>
                </motion.form>
              )}

              {/* Step 2: Primary Contact Info */}
              {signupStep === 2 && (
                <motion.form
                  key="signupStep2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignupStep2Next}
                  className="space-y-4"
                >
                  <FormField
                    label="Full Name"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={signupForm.fullName}
                    onChange={(e) => updateSignupForm({ fullName: e.target.value })}
                    icon={<User className="w-4 h-4" />}
                    portal="company"
                  />

                  <FormField
                    label="Job Title"
                    required
                    placeholder="e.g. Procurement Director"
                    value={signupForm.jobTitle}
                    onChange={(e) => updateSignupForm({ jobTitle: e.target.value })}
                    icon={<Briefcase className="w-4 h-4" />}
                    portal="company"
                  />

                  <FormField
                    label="Contact Email"
                    type="email"
                    required
                    placeholder="sarah.connor@acmeglobal.com"
                    value={signupForm.contactEmail}
                    onChange={(e) => updateSignupForm({ contactEmail: e.target.value })}
                    icon={<Mail className="w-4 h-4" />}
                    portal="company"
                    helperText="Individual contact email for account notifications"
                  />

                  <div className="flex items-center gap-3 pt-3">
                    <SecondaryButton
                      type="button"
                      portal="company"
                      onClick={() => setSignupStep(1)}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </SecondaryButton>

                    <PrimaryButton
                      type="submit"
                      portal="company"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Security
                    </PrimaryButton>
                  </div>
                </motion.form>
              )}

              {/* Step 3: Security & Passwords */}
              {signupStep === 3 && (
                <motion.form
                  key="signupStep3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignupStep3Submit}
                  className="space-y-4"
                >
                  <PasswordField
                    label="Password"
                    required
                    placeholder="••••••••••••"
                    value={signupForm.password}
                    onChange={(e) => updateSignupForm({ password: e.target.value })}
                    portal="company"
                  />

                  <PasswordStrength password={signupForm.password} />

                  <PasswordField
                    label="Confirm Password"
                    required
                    placeholder="••••••••••••"
                    value={signupForm.confirmPassword}
                    onChange={(e) => updateSignupForm({ confirmPassword: e.target.value })}
                    portal="company"
                  />

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-left">
                    <input
                      id="terms-checkbox"
                      type="checkbox"
                      checked={signupForm.agreedToTerms}
                      onChange={(e) => updateSignupForm({ agreedToTerms: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-[#714B67] focus:ring-[#714B67]/20 cursor-pointer"
                    />
                    <label
                      htmlFor="terms-checkbox"
                      className="text-xs text-slate-700 font-medium leading-relaxed cursor-pointer"
                    >
                      I agree to the{' '}
                      <a
                        href="#terms"
                        onClick={(e) => e.preventDefault()}
                        className="text-[#714B67] underline font-semibold"
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href="#privacy"
                        onClick={(e) => e.preventDefault()}
                        className="text-[#714B67] underline font-semibold"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <SecondaryButton
                      type="button"
                      portal="company"
                      onClick={() => setSignupStep(2)}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </SecondaryButton>

                    <PrimaryButton
                      type="submit"
                      portal="company"
                      isLoading={isSignupSubmitting}
                      loadingText="Creating Account..."
                      icon={<ShieldCheck className="w-4 h-4" />}
                    >
                      Create Account
                    </PrimaryButton>
                  </div>
                </motion.form>
              )}

              {/* Step 4: Verification & Workspace Redirect */}
              {signupStep === 4 && (
                <motion.div
                  key="signupStep4"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-5"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-[#714B67]">
                    <Mail className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-heading text-slate-900">
                      Account Created Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                      Your business customer account for{' '}
                      <strong className="text-slate-900">{signupForm.companyName}</strong> has been registered.
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-purple-200 font-mono text-sm text-[#714B67] font-bold inline-block">
                      {signupForm.businessEmail}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <PrimaryButton
                      portal="company"
                      onClick={() => navigate('/c-entry-x9283f/workspace')}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Go to Customer Workspace
                    </PrimaryButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Text Link back to Sign In */}
            {signupStep < 4 && (
              <div className="pt-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-600 font-medium">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLoginError(null);
                    }}
                    className="text-[#714B67] hover:text-purple-900 font-bold hover:underline transition-colors cursor-pointer"
                  >
                    Sign In to Portal
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default UnifiedAuth;
