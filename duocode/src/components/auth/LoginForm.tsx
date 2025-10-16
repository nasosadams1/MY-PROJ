import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Flame } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

interface LoginFormProps {
  onToggleForm: () => void
  onForgotPassword: () => void
  onMessage: (type: 'success' | 'error' | 'info', message: string) => void
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onForgotPassword, onMessage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [streakMessage, setStreakMessage] = useState<string>('')
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  })

  const { signIn, signInWithGoogle } = useAuth()

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value)
      if (touched.email) {
        const error = validateEmail(value)
        setErrors(prev => ({ ...prev, email: error }))
      }
    } else {
      setPassword(value)
      if (touched.password) {
        const error = validatePassword(value)
        setErrors(prev => ({ ...prev, password: error }))
      }
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    if (field === 'email') {
      const error = validateEmail(email)
      setErrors(prev => ({ ...prev, email: error }))
    } else {
      const error = validatePassword(password)
      setErrors(prev => ({ ...prev, password: error }))
    }
  }

  const getErrorMessage = (error: string): string => {
    const errorMap: { [key: string]: string } = {
      'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
      'Email not confirmed': 'Please verify your email address before signing in.',
      'Too many requests': 'Too many login attempts. Please wait a few minutes before trying again.',
      'User not found': 'No account found with this email address.',
      'Invalid email or password': 'The email or password you entered is incorrect.',
      'Network error': 'Connection failed. Please check your internet connection and try again.',
      'Signup disabled': 'New registrations are temporarily disabled. Please try again later.',
      'Failed to fetch': 'Connection failed. Please check your internet connection and try again.'
    }

    return errorMap[error] || error || 'An unexpected error occurred. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Login form submitted with:', { email, password: '***' })
    console.log('Validation result:', validateForm())
    console.log('Current errors:', errors)
    
    if (!validateForm()) {
      console.log('Form validation failed')
      onMessage('error', 'Please fix the errors below and try again.')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      console.log('Calling signIn function...')
      const result = await signIn(email.trim(), password)
      console.log('SignIn result:', result)
      
      if (result && result.error) {
        console.log('SignIn error:', result.error)
        const friendlyMessage = getErrorMessage(result.error.message)
        setErrors({ general: friendlyMessage })
        onMessage('error', friendlyMessage)
      } else {
        console.log('SignIn successful')
        
       
      }
    } catch (err: any) {
      console.error('SignIn exception:', err)
      const friendlyMessage = getErrorMessage(err.message)
      setErrors({ general: friendlyMessage })
      onMessage('error', friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrors({})
    
    try {
      console.log('Calling Google signIn...')
      const result = await signInWithGoogle()
      console.log('Google signIn result:', result)
      
      if (result && result.error) {
        console.log('Google signIn error:', result.error)
        const friendlyMessage = getErrorMessage(result.error.message)
        setErrors({ general: friendlyMessage })
        onMessage('error', friendlyMessage)
      }
    } catch (err: any) {
      console.error('Google signIn exception:', err)
      const friendlyMessage = 'Google sign-in failed. Please try again or use email/password.'
      setErrors({ general: friendlyMessage })
      onMessage('error', friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email.trim() && 
                     password && 
                     !errors.email && 
                     !errors.password

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to continue your coding journey</p>
        
        {streakMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center space-x-2"
          >
            <Flame className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-orange-800 font-medium">{streakMessage}</p>
          </motion.div>
        )}
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{errors.general}</p>
          </motion.div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email address"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 \${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
              autoComplete="email"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <motion.p
              id="email-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.email}</span>
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
              autoComplete="current-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <motion.p
              id="password-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </motion.p>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={loading}
          >
            Forgot your password?
          </button>
        </div>

                <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </motion.form>

      <motion.div 
        
      >
        
      </motion.div>

      <motion.div 
        className="mt-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="mb-4">
          Don't have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={loading}
          >
            Create one now
          </button>
        </p>
        
        
      </motion.div>
    </div>
  )
}

export default LoginForm
