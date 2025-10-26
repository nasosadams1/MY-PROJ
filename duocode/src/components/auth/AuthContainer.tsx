import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import ForgotPasswordForm from './ForgotPassword'
import { Code, X, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type AuthView = 'login' | 'signup' | 'forgot-password' | 'email-verification'

interface AuthContainerProps {
  open: boolean
  onClose: () => void
}

const AuthContainer: React.FC<AuthContainerProps> = ({ open, onClose }) => {
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [globalMessage, setGlobalMessage] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)
  const { user } = useAuth()

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (user) {
      setGlobalMessage({
        type: 'success',
        message: 'Welcome to Codhak! Your coding journey begins now.'
      })
      setTimeout(() => {
        onClose()
        setGlobalMessage(null)
      }, 2000)
    }
  }, [user, onClose])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setCurrentView('login')
      setEmail('')
      setGlobalMessage(null)
    }
  }, [open])

  if (!open) return null

  const handleToggleForm = () => {
    setCurrentView(currentView === 'login' ? 'signup' : 'login')
    setGlobalMessage(null)
  }

  const handleForgotPassword = () => {
    setCurrentView('forgot-password')
    setGlobalMessage(null)
  }

  const handleBackToLogin = () => {
    setCurrentView('login')
    setGlobalMessage(null)
  }

  // Updated to handle email confirmation flow
  const handleEmailVerification = (userEmail: string) => {
    setEmail(userEmail)
    setCurrentView('email-verification')
    setGlobalMessage({
      type: 'info',
      message: 'Please check your email and click the confirmation link to activate your account.'
    })
  }

  const handleGlobalMessage = (type: 'success' | 'error' | 'info', message: string) => {
    setGlobalMessage({ type, message })
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-4 overflow-y-auto"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full relative overflow-hidden my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="sticky top-2 sm:top-4 right-2 sm:right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 ml-auto block"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center pt-4 pb-6 px-4 sm:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </motion.div>
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Codhak
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Learn coding through interactive lessons
            </motion.p>
          </div>

          {/* Global Message */}
          <AnimatePresence>
            {globalMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 sm:px-8"
              >
                <div className={`p-4 rounded-lg mb-4 flex items-center space-x-3 ${
                  globalMessage.type === 'success' ? 'bg-green-50 border border-green-200' :
                  globalMessage.type === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  {globalMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                  {globalMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                  {globalMessage.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                  <p className={`text-sm font-medium ${
                    globalMessage.type === 'success' ? 'text-green-800' :
                    globalMessage.type === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {globalMessage.message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Forms */}
          <div className="px-4 sm:px-8 pb-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {currentView === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm 
                    onToggleForm={handleToggleForm}
                    onForgotPassword={handleForgotPassword}
                    onMessage={handleGlobalMessage}
                  />
                </motion.div>
              )}
              
              {currentView === 'signup' && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignUpForm 
                    onToggleForm={handleToggleForm}
                    onEmailVerification={handleEmailVerification}
                    onMessage={handleGlobalMessage}
                  />
                </motion.div>
              )}
              
              {currentView === 'forgot-password' && (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ForgotPasswordForm 
                    onBack={handleBackToLogin}
                    onMessage={handleGlobalMessage}
                  />
                </motion.div>
              )}

              {currentView === 'email-verification' && (
                <motion.div
                  key="email-verification"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                 
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading overlay */}
          <AnimatePresence>
            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Setting up your account...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthContainer
