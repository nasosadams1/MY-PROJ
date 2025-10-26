import { useState, useCallback } from 'react';
import { User } from '../context/UserContext';

export const useHeartSystem = (initialUser: User) => {
  const [user, setUser] = useState<User>(initialUser);
  const [heartLostThisQuestion, setHeartLostThisQuestion] = useState(false);

  const loseHeart = useCallback(() => {
    setUser(prevUser => {
      if (heartLostThisQuestion) return prevUser; // already lost a heart for this question
      setHeartLostThisQuestion(true);
      return {
        ...prevUser,
        hearts: Math.max(0, prevUser.hearts - 1)
      };
    });
  }, [heartLostThisQuestion]);

  const resetHeartLoss = useCallback(() => {
    setHeartLostThisQuestion(false);
  }, []);

  const gainHeart = useCallback(() => {
    setUser(prevUser => ({
      ...prevUser,
      hearts: Math.min(prevUser.maxHearts, prevUser.hearts + 1)
    }));
  }, []);

  const gainXP = useCallback((amount: number) => {
    setUser(prevUser => ({
      ...prevUser,
      xp: prevUser.xp + amount
    }));
  }, []);

  const canAccessLessons = user.hearts > 0;

  return {
    user,
    loseHeart,
    gainHeart,
    gainXP,
    resetHeartLoss, // <-- call this when moving to the next question
    canAccessLessons
  };
};
