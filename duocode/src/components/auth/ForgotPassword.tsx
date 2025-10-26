import React, { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

interface ForgotPasswordFormProps {
  onBack: () => void
  onMessage: (type: 'success' | 'error' | 'info', message: string) => void
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onMessage }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const { resetPassword } = useAuth()

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address'
    return undefined
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (touched) {
      const emailError = validateEmail(value)
      setError(emailError || '')
    }
    if (error && value.trim()) {
      setError('')
    }
  }

  const handleBlur = () => {
    setTouched(true)
    const emailError = validateEmail(email)
    setError(emailError || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      setTouched(true)
      onMessage('error', emailError)
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await resetPassword(email.trim())
      
      if (error) {
        const errorMessage = error.message || 'Failed to send reset email. Please try again.'
        setError(errorMessage)
        onMessage('error', errorMessage)
      } else {
        setSent(true)
        onMessage('success', 'Password reset email sent! Check your inbox.')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      onMessage('error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleTryAgain = () => {
    setSent(false)
    setEmail('')
    setError('')
    setTouched(false)
  }

  if (sent) {
    return (
      <motion.div 
        className="w-full max-w-md mx-auto text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-2">
            We've sent a password reset link to
          </p>
          <p className="font-semibold text-gray-900 mb-4">{email}</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the reset link in the email</li>
              <li>Create a new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>
          
          <button
            onClick={handleTryAgain}
            className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            Try Another Email
          </button>

          <button
            onClick={onBack}
            className="w-full py-3 px-6 text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Didn't receive the email?</strong> Check your spam folder or wait a few minutes. 
              The email might take some time to arrive.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to sign in
      </motion.button>

      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        <div className="space-y-2">
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              className={`w-full pl-10 pr-4 py-4 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 ${
                error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
              autoComplete="email"
            />
            {!error && email && touched && validateEmail(email) === undefined && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          {error && touched && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !!error || !email.trim()}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Sending Reset Link...
            </div>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </motion.form>

      <motion.div 
        className="mt-8 p-4 bg-gray-50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-900 mb-2">Security Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use a strong, unique password</li>
          <li>• Don't share your password with anyone</li>
          <li>• Consider using a password manager</li>
          <li>• Enable two-factor authentication when available</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordForm