import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.ts'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const AuthConfirm: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthConfirm = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!token_hash || !type) {
          setStatus('error')
          setMessage('Invalid confirmation link. Please try signing up again.')
          // Redirect to homepage after 2 seconds
          setTimeout(() => {
            navigate('/')
          }, 2000)
          return
        }

        console.log('🔄 Processing auth confirmation:', { type, token_hash: token_hash.substring(0, 10) + '...' })

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any
        })

        if (error) {
          console.error('❌ Confirmation error:', error)
          setStatus('error')
          setMessage('Failed to confirm your account. The link may have expired.')
          // Redirect to homepage after 2 seconds
          setTimeout(() => {
            navigate('/')
          }, 2000)
          return
        }

        if (data.user) {
          console.log('✅ Email confirmed successfully for user:', data.user.id)
          setStatus('success')
          setMessage('Your email has been confirmed! Redirecting to your dashboard...')
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/')
          }, 2000)
        }
      } catch (error) {
        console.error('❌ Unexpected confirmation error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
        // Redirect to homepage after 2 seconds
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    }

    handleAuthConfirm()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirming Your Account</h1>
            <p className="text-gray-600">Please wait while we verify your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">{"We're sorry, but we couldn't confirm your email. Please try signing up again."}</p>
            <p className="text-sm text-gray-500 mb-4">Redirecting to homepage in 2 seconds...</p>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Go to Homepage Now
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Codhak!</h1>
            <p className="text-gray-600 mb-6">{"We're glad to have you on board!"}</p>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthConfirm
