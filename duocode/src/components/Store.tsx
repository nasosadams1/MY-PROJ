import React, { useState } from 'react';
import { X, Coins, Zap, Heart, Clock, Star, Crown, Gift, ShoppingCart, CreditCard } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import StripeCheckout from './StripeCheckout';

interface StoreItem {
  id: string;
  type: 'coins' | 'xp_boost' | 'hearts' | 'unlimited_hearts';
  name: string;
  description: string;
  coins?: number;
  price: number; // in USD cents or coins
  priceDisplay: string;
  bonus?: number; // bonus percentage
  duration?: number; // in hours for time-limited items
  multiplier?: number; // for XP boosts
  icon: React.ReactNode;
  popular?: boolean;
  bestValue?: boolean;
  gradient: string;
  glowColor: string;
}

const Store: React.FC = () => {
  const { user, purchaseWithCoins, addCoins, activateXPBoost, activateUnlimitedHearts, refillHearts, addNotification } = useUser();
  const { user: authUser } = useAuth();
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Store items with proper pricing
  const storeItems: StoreItem[] = [
    // Coin Packages (real money purchases)
    {
      id: 'coins_100',
      type: 'coins',
      name: '100 Coins',
      description: 'Perfect starter pack',
      coins: 100,
      price: 199, // $1.99 in cents
      priceDisplay: '$1.99',
      icon: <Coins className="w-8 h-8" />,
      gradient: 'from-yellow-400 to-orange-500',
      glowColor: 'shadow-yellow-500/25'
    },
    {
      id: 'coins_260',
      type: 'coins',
      name: '260 Coins',
      description: 'Most popular choice',
      coins: 260,
      price: 499, // $4.99 in cents
      priceDisplay: '$4.99',
      bonus: 4,
      popular: true,
      icon: <Coins className="w-8 h-8" />,
      gradient: 'from-blue-400 to-purple-500',
      glowColor: 'shadow-blue-500/25'
    },
    {
      id: 'coins_600',
      type: 'coins',
      name: '600 Coins',
      description: 'Great value pack',
      coins: 600,
      price: 999, // $9.99 in cents
      priceDisplay: '$9.99',
      bonus: 23,
      icon: <Coins className="w-8 h-8" />,
      gradient: 'from-purple-400 to-pink-500',
      glowColor: 'shadow-purple-500/25'
    },
    {
      id: 'coins_1280',
      type: 'coins',
      name: '1,280 Coins',
      description: 'Premium bundle',
      coins: 1280,
      price: 1999, // $19.99 in cents
      priceDisplay: '$19.99',
      bonus: 28,
      icon: <Crown className="w-8 h-8" />,
      gradient: 'from-orange-400 to-red-500',
      glowColor: 'shadow-orange-500/25'
    },
    {
      id: 'coins_2000',
      type: 'coins',
      name: '2,000 Coins',
      description: 'Ultimate value',
      coins: 2000,
      price: 2999, // $29.99 in cents
      priceDisplay: '$29.99',
      bonus: 33,
      bestValue: true,
      icon: <Crown className="w-8 h-8" />,
      gradient: 'from-pink-400 to-red-500',
      glowColor: 'shadow-pink-500/25'
    },
    {
      id: 'coins_3400',
      type: 'coins',
      name: '3,400 Coins',
      description: 'Mega bundle',
      coins: 3400,
      price: 4999, // $49.99 in cents
      priceDisplay: '$49.99',
      bonus: 36,
      icon: <Star className="w-8 h-8" />,
      gradient: 'from-indigo-400 to-purple-600',
      glowColor: 'shadow-indigo-500/25'
    },
    {
      id: 'coins_7200',
      type: 'coins',
      name: '7,200 Coins',
      description: 'Maximum value',
      coins: 7200,
      price: 9999, // $99.99 in cents
      priceDisplay: '$99.99',
      bonus: 44,
      icon: <Gift className="w-8 h-8" />,
      gradient: 'from-emerald-400 to-teal-500',
      glowColor: 'shadow-emerald-500/25'
    },

    // XP Boosts (coin purchases)
    {
      id: 'xp_boost_2x_1h',
      type: 'xp_boost',
      name: '2x XP Boost',
      description: '1 hour duration',
      price: 150, // 150 coins
      priceDisplay: '150 coins',
      duration: 1,
      multiplier: 2,
      icon: <Zap className="w-8 h-8" />,
      gradient: 'from-green-400 to-blue-500',
      glowColor: 'shadow-green-500/25'
    },
    {
      id: 'xp_boost_2x_3h',
      type: 'xp_boost',
      name: '2x XP Boost',
      description: '3 hours duration',
      price: 400, // 400 coins
      priceDisplay: '400 coins',
      duration: 3,
      multiplier: 2,
      popular: true,
      icon: <Zap className="w-8 h-8" />,
      gradient: 'from-blue-400 to-purple-500',
      glowColor: 'shadow-blue-500/25'
    },
    {
      id: 'xp_boost_3x_1h',
      type: 'xp_boost',
      name: '3x XP Boost',
      description: '1 hour duration',
      price: 250, // 250 coins
      priceDisplay: '250 coins',
      duration: 1,
      multiplier: 3,
      icon: <Zap className="w-8 h-8" />,
      gradient: 'from-purple-400 to-pink-500',
      glowColor: 'shadow-purple-500/25'
    },

    // Heart Packages (coin purchases)
    {
      id: 'heart_refill',
      type: 'hearts',
      name: 'Refill Hearts',
      description: 'Restore all hearts',
      price: 85, // 85 coins
      priceDisplay: '85 coins',
      icon: <Heart className="w-8 h-8" />,
      gradient: 'from-red-400 to-pink-500',
      glowColor: 'shadow-red-500/25'
    },
    {
      id: 'unlimited_hearts_1h',
      type: 'unlimited_hearts',
      name: 'Unlimited Hearts',
      description: '1 hour duration',
      price: 300, // 300 coins
      priceDisplay: '300 coins',
      duration: 1,
      icon: <Heart className="w-8 h-8" />,
      gradient: 'from-pink-400 to-red-500',
      glowColor: 'shadow-pink-500/25'
    },
    {
      id: 'unlimited_hearts_3h',
      type: 'unlimited_hearts',
      name: 'Unlimited Hearts',
      description: '3 hours duration',
      price: 600, // 600 coins
      priceDisplay: '600 coins',
      duration: 3,
      popular: true,
      icon: <Heart className="w-8 h-8" />,
      gradient: 'from-red-400 to-orange-500',
      glowColor: 'shadow-red-500/25'
    },
    {
      id: 'unlimited_hearts_24h',
      type: 'unlimited_hearts',
      name: 'Unlimited Hearts',
      description: '24 hours duration',
      price: 2000, // 2000 coins
      priceDisplay: '2000 coins',
      duration: 24,
      bestValue: true,
      icon: <Crown className="w-8 h-8" />,
      gradient: 'from-orange-400 to-red-600',
      glowColor: 'shadow-orange-500/25'
    }
  ];

 const handlePurchase = async (item: StoreItem) => {
  if (!authUser) {
    addNotification({
      message: 'Please sign in to make purchases',
      type: 'warning',
      icon: '⚠️'
    });
    return;
  }
  
  // Handle coin purchases (items that cost coins)
  if (item.type !== 'coins') {
    try {
      const success = await purchaseWithCoins(item.price);
      if (success) {
        // Apply the purchased item effects using UserContext functions
        switch (item.type) {
          case 'hearts':
            await refillHearts();
            break;
          case 'xp_boost':
            if (item.multiplier && item.duration) {
              await activateXPBoost(item.multiplier, item.duration);
            }
            break;
          case 'unlimited_hearts':
            if (item.duration) {
              await activateUnlimitedHearts(item.duration);
            }
            break;
          default:
            console.warn('Unknown item type:', item.type);
        }
      } else {
        addNotification({
          message: 'Not enough coins! Purchase more coins to continue.',
          type: 'error',
          icon: '💰'
        });
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      addNotification({
        message: 'Purchase failed. Please try again.',
        type: 'error',
        icon: '❌'
      });
    }
    return;
  }
  
  // Handle real money purchases (coin packages)
  setSelectedItem(item);
  setShowPaymentModal(true);
};

  const handlePaymentSuccess = (paymentIntent: any) => {
    if (selectedItem?.coins) {
      addCoins(selectedItem.coins);
    }
    
    setShowPaymentModal(false);
    setSelectedItem(null);
    
    addNotification({
      message: `Payment successful! You received ${selectedItem?.coins} coins!`,
      type: 'success',
      icon: '🎉'
    });
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    
    // Show the user-friendly notification for payment errors
    addNotification({
      message: "Oops! Your payment didn't go through. Please check your card details or try a different payment method.",
      type: 'error',
      icon: '💳'
    });
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">Codhak Store</h1>
          <p className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Enhance your coding journey with premium coins, XP boosts, and unlimited hearts
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900">{user.coins} coins</span>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-2xl p-4 lg:p-6 mb-8 text-white shadow-xl mx-2 lg:mx-0">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <div>
              <h3 className="text-xl lg:text-2xl font-bold mb-2">🎉 Limited Time Offer!</h3>
              <p className="text-white/90 text-sm lg:text-base">Get up to 44% bonus coins on large packages</p>
            </div>
            <div className="text-center sm:text-right mt-4 sm:mt-0">
              <div className="text-3xl font-bold">44%</div>
              <div className="text-sm text-white/80">BONUS</div>
            </div>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 px-2 lg:px-0">
          {storeItems.map((item) => (
            <div
              key={item.id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${item.glowColor} hover:shadow-2xl transform hover:-translate-y-1`}
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10">
                {item.popular && (
                  <div className="bg-red-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold mb-2">
                    POPULAR
                  </div>
                )}
                {item.bestValue && (
                  <div className="bg-green-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold mb-2">
                    BEST VALUE
                  </div>
                )}
                {item.bonus && (
                  <div className="bg-orange-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold">
                    +{item.bonus}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`bg-gradient-to-br ${item.gradient} p-4 lg:p-6 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-xl mb-4 mx-auto backdrop-blur-sm">
                    {item.icon}
                  </div>
                  
                  {item.type === 'coins' && (
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold mb-1">{item.coins?.toLocaleString()}</div>
                      <div className="text-white/80 text-sm">Coins</div>
                    </div>
                  )}
                  
                  {item.type === 'xp_boost' && (
                    <div className="text-center">
                      <div className="text-xl lg:text-2xl font-bold mb-1">{item.multiplier}x XP</div>
                      <div className="text-white/80 text-sm">{item.duration}h duration</div>
                    </div>
                  )}
                  
                  {(item.type === 'hearts' || item.type === 'unlimited_hearts') && (
                    <div className="text-center">
                      <div className="text-xl lg:text-2xl font-bold mb-1">
                        {item.type === 'hearts' ? 'Full Hearts' : 'Unlimited'}
                      </div>
                      <div className="text-white/80 text-sm">
                        {item.duration ? `${item.duration}h duration` : 'Instant refill'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 lg:p-6">
                <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl lg:text-2xl font-bold text-gray-900">{item.priceDisplay}</div>
                  {item.bonus && (
                    <div className="text-green-600 text-sm font-semibold">
                      Save {item.bonus}%
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  className={`w-full py-2 lg:py-3 bg-gradient-to-r ${item.gradient} hover:shadow-lg text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 text-sm lg:text-base ${
                    item.type !== 'coins' && user.coins < item.price ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={item.type !== 'coins' && user.coins < item.price}
                >
                  {item.type === 'coins' ? 'Buy Now' : 
                   user.coins < item.price ? 'Not Enough Coins' : 'Purchase'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-white rounded-xl p-4 lg:p-6 shadow-md border border-gray-100 mx-2 lg:mx-0">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Instant Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedItem && (
        <StripeCheckout
          amount={selectedItem.price}
          description={`${selectedItem.name} - ${selectedItem.description}`}
          coins={selectedItem.coins}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Store;
