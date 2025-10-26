import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

interface SignUpFormProps {
  onToggleForm: () => void
  onEmailVerification: (email: string) => void
  onMessage: (type: 'success' | 'error' | 'info', message: string) => void
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleForm, onEmailVerification, onMessage }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{
    name: boolean
    email: boolean
    password: boolean
    confirmPassword: boolean
  }>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  const { signUp, signInWithGoogle } = useAuth()

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) score += 1
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(password)) score += 1
    else feedback.push('One lowercase letter')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('One uppercase letter')

    if (/\d/.test(password)) score += 1
    else feedback.push('One number')

    if (/[^a-zA-Z0-9]/.test(password)) score += 1
    else feedback.push('One special character')

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    const color = colors[Math.min(score, 4)]

    return { score, feedback, color }
  }

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Username is required'
    if (name.trim().length < 2) return 'Username must be at least 2 characters'
    if (name.trim().length > 16) return 'Username must be 16 characters or less'
    if (!/^[a-zA-Z0-9_]+$/.test(name.trim())) return 'Username can only contain letters, numbers, and underscores'
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    
    const strength = checkPasswordStrength(password)
    if (strength.score < 3) return 'Password is too weak'
    
    return undefined
  }

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password'
    if (confirmPassword !== password) return 'Passwords do not match'
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password)
    
    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormErrors, value: string) => {
    switch (field) {
      case 'name':
        setName(value)
        if (touched.name) {
          const error = validateName(value)
          setErrors(prev => ({ ...prev, name: error }))
        }
        break
      case 'email':
        setEmail(value)
        if (touched.email) {
          const error = validateEmail(value)
          setErrors(prev => ({ ...prev, email: error }))
        }
        break
      case 'password':
        setPassword(value)
        if (touched.password) {
          const error = validatePassword(value)
          setErrors(prev => ({ ...prev, password: error }))
        }
        if (touched.confirmPassword && confirmPassword) {
          const confirmError = validateConfirmPassword(confirmPassword, value)
          setErrors(prev => ({ ...prev, confirmPassword: confirmError }))
        }
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        if (touched.confirmPassword) {
          const error = validateConfirmPassword(value, password)
          setErrors(prev => ({ ...prev, confirmPassword: error }))
        }
        break
    }
    
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    switch (field) {
      case 'name':
        const nameError = validateName(name)
        setErrors(prev => ({ ...prev, name: nameError }))
        break
      case 'email':
        const emailError = validateEmail(email)
        setErrors(prev => ({ ...prev, email: emailError }))
        break
      case 'password':
        const passwordError = validatePassword(password)
        setErrors(prev => ({ ...prev, password: passwordError }))
        break
      case 'confirmPassword':
        const confirmError = validateConfirmPassword(confirmPassword, password)
        setErrors(prev => ({ ...prev, confirmPassword: confirmError }))
        break
    }
  }

  const getErrorMessage = (error: string): string => {
    const errorMap: { [key: string]: string } = {
      'User already registered': 'An account with this email already exists. Try signing in instead.',
      'Username already taken': 'This username is already taken. Please choose a different one.',
      'Email rate limit exceeded': 'Too many signup attempts. Please wait a few minutes before trying again.',
      'Signup disabled': 'New registrations are temporarily disabled. Please try again later.',
      'Invalid email': 'Please enter a valid email address.',
      'Weak password': 'Password is too weak. Please choose a stronger password.',
      'Network error': 'Connection failed. Please check your internet connection and try again.'
    }

    return errorMap[error] || error || 'An unexpected error occurred. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted with username:', name.trim())
    
    if (!validateForm()) {
      console.log('Form validation failed')
      onMessage('error', 'Please fix the errors below and try again.')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      console.log('Calling signUp function with username:', name.trim())
      const result = await signUp(email.trim(), password, name.trim())
      console.log('SignUp result:', result)
      
      if (result && result.error) {
        console.log('SignUp error:', result.error)
        const friendlyMessage = getErrorMessage(result.error.message)
        setErrors({ general: friendlyMessage })
        onMessage('error', friendlyMessage)
      } else {
        console.log('SignUp successful with username:', name.trim())
        // Show email verification screen
        onEmailVerification(email.trim())
        onMessage('success', `Account created! Please check your email to confirm your account.`)
      }
    } catch (err: any) {
      console.error('SignUp exception:', err)
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
      const friendlyMessage = 'Google sign-up failed. Please try again or use email/password.'
      setErrors({ general: friendlyMessage })
      onMessage('error', friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = password ? checkPasswordStrength(password) : null

  // Check if form is valid for submit button
  const isFormValid = name.trim() && 
                     email.trim() && 
                     password && 
                     confirmPassword && 
                     !errors.name && 
                     !errors.email && 
                     !errors.password && 
                     !errors.confirmPassword

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join Codhak and start your coding journey</p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* General Error */}
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

        {/* Username Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className={`h-5 w-5 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Choose a unique username"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
              autoComplete="username"
              maxLength={16}
            />
            {!errors.name && name && touched.name && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.name}</span>
            </motion.p>
          )}
          <p className="text-xs text-gray-500">
            This will be your display name and can be changed later in your profile. (Max 16 characters)
          </p>
        </div>

        {/* Email Field */}
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
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
              autoComplete="email"
            />
            {!errors.email && email && touched.email && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.email}</span>
            </motion.p>
          )}
        </div>

        {/* Password Field */}
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
              placeholder="Create a strong password"
              className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
              autoComplete="new-password"
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
          
          {/* Password Strength Indicator */}
          {password && passwordStrength && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">
                  {passwordStrength.score < 2 ? 'Weak' : 
                   passwordStrength.score < 4 ? 'Fair' : 
                   passwordStrength.score < 5 ? 'Good' : 'Strong'}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-xs text-gray-600">
                  <span>Missing: {passwordStrength.feedback.join(', ')}</span>
                </div>
              )}
            </div>
          )}
          
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </motion.p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirm your password"
              className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {!errors.confirmPassword && confirmPassword && password && confirmPassword === password && (
              <div className="absolute inset-y-0 right-12 pr-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 flex items-center space-x-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.confirmPassword}</span>
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </motion.form>

      {/* Sign In Link */}
      <motion.div 
        className="mt-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="mb-4">
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={loading}
          >
            Sign in here
          </button>
        </p>
      </motion.div>
    </div>
  )
}

export default SignUpForm
