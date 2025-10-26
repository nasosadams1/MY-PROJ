import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  ArrowRight,
  Heart,
  Clock,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { getLessonById, calculateXP, allLessons as lessonsData } from "../data/lessons";
import { Zap } from "lucide-react";

interface LessonModalProps {
  content?: any;
  lesson: any;
  allLessons?: any[];
  onClose: () => void;
  onHeartLoss?: () => void;
  onRedirectToLearn?: () => void;
  completeLesson?: (id: string, xp: number, coins: number) => void;
  calculateXPOverride?: typeof calculateXP;
  loseHeartOverride?: (count?: number) => void;
  resetHeartLossOverride?: () => void;
  forceSkipQuiz?: boolean;
}

const renderWithNewlines = (text?: string | null) => {
  if (text === null || text === undefined) return null;
  if (typeof text !== "string") return text;
  return text.split("\n").map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < text.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));
};

const formatTime = (seconds: number) => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
};

const LessonModal: React.FC<LessonModalProps> = ({
   content: contentProp,
  lesson,
  allLessons: allLessonsProp,
  onClose,
  onHeartLoss,
  onRedirectToLearn,
  completeLesson: completeLessonProp,
  calculateXPOverride,
  loseHeartOverride,
  resetHeartLossOverride,
  forceSkipQuiz = false,
}) => {
  // CRITICAL FIX: Move ALL hooks to the top, before any conditional logic
  const { user, completeLesson: ctxCompleteLesson, loseHeart, resetHeartLoss, debugUserState, verifyDatabaseSync, isXPBoostActive, isUnlimitedHeartsActive, getActiveBoosts } = useUser();
  const completeLessonFn = completeLessonProp ?? ctxCompleteLesson;
  const loseHeartFn = loseHeartOverride ?? loseHeart;
  const resetHeartLossFn = resetHeartLossOverride ?? resetHeartLoss;
  const calculateXPFn = calculateXPOverride ?? calculateXP;
  const allLessons = allLessonsProp ?? lessonsData;
  const activeBoosts = getActiveBoosts();

  const fullLesson = getLessonById ? getLessonById(lesson?.id) : null;

  let content: { steps: any[]; quiz?: any[] } =
    contentProp
      ? JSON.parse(JSON.stringify(contentProp))
      : fullLesson
      ? JSON.parse(JSON.stringify(fullLesson.content ?? { steps: [], quiz: [] }))
      : lesson?.content
      ? JSON.parse(JSON.stringify(lesson.content))
      : { steps: [], quiz: [] };

  // safe totals
  const safeTotalSteps = Math.max(0, (content.steps?.length ?? 0));
  const safeTotalQuiz = Math.max(0, (content.quiz?.length ?? 0));
  const effectiveQuizCount = forceSkipQuiz ? 0 : safeTotalQuiz;
  const safeTotalAll = Math.max(1, safeTotalSteps + effectiveQuizCount);

  // ALL state hooks must be declared here, before any conditional returns
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [midLessonResults, setMidLessonResults] = useState<boolean[]>([]);
  const [startTime] = useState(Date.now());
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);

  const theorySteps = (content.steps || []).filter((s) => s?.type === "theory");
  const questionSteps = (content.steps || []).filter((s) => s?.type === "question");

  // UPDATED: Enhanced heart check - redirect to learn page when hearts reach 0
  useEffect(() => {
    if (user?.hearts <= 0 && !isUnlimitedHeartsActive()) {
      console.log('💔 No hearts remaining and unlimited hearts not active - redirecting to learn page');
      if (onHeartLoss) onHeartLoss();
      if (onRedirectToLearn) {
        onRedirectToLearn();
      }
      setShouldClose(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hearts, isUnlimitedHeartsActive]);

  useEffect(() => {
    setCurrentStep((s) => Math.max(0, Math.min(s, Math.max(0, safeTotalSteps - 1))));
    setCurrentQuizIndex((q) => Math.max(0, Math.min(q, Math.max(0, effectiveQuizCount - 1))));
    setSelectedAnswer(null);
    setShowQuizResult(false);
    setIsQuizMode(false);
    setIsCompleted(false);
    setQuizResults([]);
    setMidLessonResults([]);
    setShowRetakeModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, JSON.stringify(content)]);

  // CRITICAL FIX: Handle close after all hooks are declared
  useEffect(() => {
    if (shouldClose) {
      onClose();
    }
  }, [shouldClose, onClose]);

  // UPDATED: Don't block lesson if unlimited hearts is active, but check after hooks
  if (user?.hearts <= 0 && !isUnlimitedHeartsActive()) {
    return null;
  }

  if (safeTotalSteps === 0 && effectiveQuizCount === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Content Loading...</h2>
          <button onClick={onClose} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = (content.steps || [])[currentStep] ?? null;
  const currentQuizItem = (content.quiz || [])[currentQuizIndex] ?? null;

  // progress: 1-based shows
  const currentProgressInternal = isQuizMode
    ? midLessonResults.filter(Boolean).length + (currentQuizIndex + 1)
    : (currentStep + 1);
  const shownProgress = Math.min(currentProgressInternal, safeTotalAll);
  const percent = Math.round((shownProgress / safeTotalAll) * 100);

  const isCurrentStepQuestion = !isQuizMode && currentStepData?.type === "question" && !!currentStepData?.question;

  // helper to finalize lesson (shared for quiz-less and quiz completion)
  // helper to finalize lesson (shared for quiz-less and quiz completion)
const finalizeLesson = async () => {
  const actualTime = (Date.now() - startTime) / (1000 * 60);
  const languageLessons = allLessons.filter((l) => l.language === lesson.language);
  const lessonIndex = languageLessons.findIndex((l) => l.id === lesson.id);

  const earnedXP = calculateXPFn(
    lesson.baseXP,
    lesson.difficulty,
    lessonIndex,
    languageLessons.length,
    actualTime,
    lesson.baselineTime
  );

  console.log('🎓 FINALIZING LESSON:', {
    lessonId: lesson.id,
    earnedXP,
    lessonLanguage: lesson.language,
    currentCompletedLessons: user.completedLessons,
    alreadyCompleted: user.completedLessons.includes(lesson.id)
  });

  // CRITICAL FIX: Only complete if not already completed
  if (!user.completedLessons.includes(lesson.id)) {
    try {
      if (completeLessonFn) {
        // Complete the lesson first and wait for it to finish
        await completeLessonFn(lesson.id, earnedXP, 0);
        console.log('✅ LESSON COMPLETED SUCCESSFULLY:', lesson.id);
        
        // CRITICAL FIX: Wait a bit for the lesson completion to fully process
        // then check for achievements - this ensures lesson XP is already added
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now check for achievements - the UserContext will handle adding achievement XP
        // on top of the lesson XP that was just awarded
        console.log('🏆 Checking for achievements after lesson completion...');
        
        // Debug current state after completion
        setTimeout(() => {
          console.log('🔍 POST-COMPLETION STATE CHECK:');
          debugUserState();
          verifyDatabaseSync();
        }, 500);
      } else {
        console.error('❌ NO COMPLETE LESSON FUNCTION AVAILABLE');
      }
    } catch (error) {
      console.error('❌ LESSON COMPLETION FAILED:', error);
    }
  } else {
    console.log('⚠️ LESSON ALREADY COMPLETED:', lesson.id);
  }
  
  setIsCompleted(true);
};


  const restartLesson = () => {
    setCurrentStep(0);
    setIsQuizMode(false);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowQuizResult(false);
    setQuizResults([]);
    setMidLessonResults([]);
    setShowRetakeModal(false);
    resetHeartLossFn?.();
  };

  const goToNextStep = () => {
    let nextStep = currentStep + 1;
    while (
      nextStep < safeTotalSteps &&
      (content.steps[nextStep]?.type === "question") &&
      !content.steps[nextStep]?.question
    ) nextStep++;

    if (nextStep < safeTotalSteps) {
      setCurrentStep(nextStep);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      resetHeartLossFn?.();
    } else {
      // if there is no quiz (effectiveQuizCount === 0), finalize immediately
      if (effectiveQuizCount === 0) {
        finalizeLesson();
        return;
      }

      resetHeartLossFn?.();
      setIsQuizMode(true);
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
      setShowQuizResult(false);
    }
  };

  const goToPreviousStep = () => {
    let prev = currentStep - 1;
    while (
      prev >= 0 &&
      (content.steps[prev]?.type === "question") &&
      !content.steps[prev]?.question
    ) prev--;

    if (prev >= 0) {
      setCurrentStep(prev);
      setSelectedAnswer(null);
      setShowQuizResult(false);
    }
  };

  const handleNext = () => {
    if (!currentStepData) {
      if (currentStep >= safeTotalSteps && effectiveQuizCount > 0) {
        setIsQuizMode(true);
        setCurrentQuizIndex(0);
      } else if (currentStep >= safeTotalSteps && effectiveQuizCount === 0) {
        finalizeLesson();
      }
      return;
    }

    if (currentStepData.type === "question") {
      if (selectedAnswer === null) return;
      const isCorrect = selectedAnswer === currentStepData.correctAnswer;
      setMidLessonResults((p) => [...p, isCorrect]);
      if (!isCorrect) {
        loseHeartFn?.();
        setShowQuizResult(true);
        // FIXED: Always show retake modal for wrong answers
        setTimeout(() => {
          setShowRetakeModal(true);
        }, 1500);
      } else {
        setShowQuizResult(true);
      }
    } else {
      if (currentStep < safeTotalSteps - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // finished steps
        if (effectiveQuizCount === 0) {
          finalizeLesson();
        } else {
          setIsQuizMode(true);
          setCurrentQuizIndex(0);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (isQuizMode) {
      setIsQuizMode(false);
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      return;
    }
    if (currentStep > 0) goToPreviousStep();
  };

  const handleQuizAnswer = (answerIndex: number) => setSelectedAnswer(answerIndex);

  const handleQuizNext = () => {
    if (selectedAnswer === null) return;

    const currentQuiz = currentQuizItem;
    if (!currentQuiz) return;

    // Mark answer correctness
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    const newResults = [...quizResults, isCorrect];
    setQuizResults(newResults);
    if (!isCorrect) {
      loseHeartFn?.();
      setShowQuizResult(true);
      // FIXED: Always show retake modal for wrong answers
      setTimeout(() => {
        setShowRetakeModal(true);
      }, 1500);
    } else {
      setShowQuizResult(true);
    }
  };

  // FIXED: Always prevent progression on wrong answers
  const handleQuestionNext = () => {
    const isCorrect = selectedAnswer === currentStepData.correctAnswer;
    if (!isCorrect) {
      // FIXED: Always prevent progression on wrong answers
      return; // retake modal will be shown
    }
    
    setShowQuizResult(false);
    setSelectedAnswer(null);
    if (currentStep < safeTotalSteps - 1) {
      resetHeartLossFn?.();
      setCurrentStep((s) => s + 1);
    } else {
      // finished steps
      if (effectiveQuizCount === 0) {
        finalizeLesson();
      } else {
        resetHeartLossFn?.();
        setIsQuizMode(true);
        setCurrentQuizIndex(0);
      }
    }
  };

  // FIXED: Always prevent progression on wrong answers
  const handleQuizQuestionNext = () => {
    const isCorrect = selectedAnswer === currentQuizItem.correctAnswer;
    if (!isCorrect) {
      // FIXED: Always prevent progression on wrong answers
      return; // retake modal will be shown
    }

    if (!content.quiz || !Array.isArray(content.quiz)) {
      // no quiz available, finalize immediately
      finalizeLesson();
      return;
    }

    let nextQuizIndex = currentQuizIndex + 1;
    while (nextQuizIndex < content.quiz.length && !content.quiz[nextQuizIndex]?.question) {
      nextQuizIndex++;
    }

    if (nextQuizIndex < content.quiz.length) {
      resetHeartLossFn?.();
      setCurrentQuizIndex(nextQuizIndex);
      setSelectedAnswer(null);
      setShowQuizResult(false);
    } else {
      // quiz finished -> finalize
      finalizeLesson();
    }
  };

  // FIXED: Updated retake modal - always show for wrong answers and redirect to learn page
  if (showRetakeModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Incorrect Answer
          </h2>
          <p className="text-gray-600 mb-6">
            You got the answer wrong. {user?.hearts <= 0 && !isUnlimitedHeartsActive() 
              ? "You have no hearts left and will be redirected to the learn page." 
              : "You need to retake the lesson to continue learning."}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                if (user?.hearts <= 0 && !isUnlimitedHeartsActive()) {
                  if (onRedirectToLearn) onRedirectToLearn();
                }
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {user?.hearts <= 0 && !isUnlimitedHeartsActive() ? "Go to Learn Page" : "Exit Lesson"}
            </button>
            {(user?.hearts > 0 || isUnlimitedHeartsActive()) && (
              <button
                onClick={restartLesson}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Lesson</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const correctAnswers = quizResults.filter(Boolean).length;
    const correctMidAnswers = midLessonResults.filter(Boolean).length;
    const actualTimeSeconds = (Date.now() - startTime) / 1000;
    const languageLessons = allLessons.filter((l) => l.language === lesson.language);
    const lessonIndex = languageLessons.findIndex((l) => l.id === lesson.id);

    const baseXP = calculateXPFn(
      lesson.baseXP,
      lesson.difficulty,
      lessonIndex,
      languageLessons.length,
      actualTimeSeconds / 60,
      lesson.baselineTime
    );
    
    const boostMultiplier = isXPBoostActive() ? (activeBoosts.xpBoost?.multiplier || 1) : 1;
    const earnedXP = Math.floor(baseXP * boostMultiplier);

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-lg w-full mx-4 p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
          <div className="mb-4 space-y-2">
            <p className="text-gray-600">
              You earned <span className="font-semibold text-green-600">{earnedXP} XP</span>
              {boostMultiplier > 1 && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {boostMultiplier}x Boost!
                </span>
              )}
            </p>
            {questionSteps.length > 0 && (
              <p className="text-gray-600">
                Correct Answers: <span className="font-semibold text-blue-600">{correctMidAnswers}/{questionSteps.length}</span>
              </p>
            )}
            {effectiveQuizCount > 0 && (
              <p className="text-gray-600">
                Final quiz: <span className="font-semibold text-blue-600">{correctAnswers}/{effectiveQuizCount}</span>
              </p>
            )}
            <div className="flex items-center justify-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Completed in {formatTime(actualTimeSeconds)}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Great job! You've unlocked the next lesson.</p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  if (isQuizMode) {
    const currentQuestion = currentQuizItem;
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50">
        <div className="h-full flex flex-col">
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{lesson.title}</h2>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Quiz Progress:</span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: effectiveQuizCount }, (_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < currentQuizIndex ? "bg-green-500" : i === currentQuizIndex ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{Math.min(currentQuizIndex + 1, effectiveQuizCount)}/{effectiveQuizCount}</span>
                </div>

                {/* UPDATED: Enhanced hearts display with unlimited hearts indicator */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Hearts:</span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 ${
                          activeBoosts.unlimitedHearts 
                            ? "text-pink-500 fill-current animate-pulse" 
                            : i < (user?.hearts ?? 0) 
                            ? "text-red-500 fill-current" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {activeBoosts.unlimitedHearts ? '∞' : `${user?.hearts ?? 0}/5`}
                  </span>
                </div>
                
                {/* Show active XP boost in lesson header */}
                {activeBoosts.xpBoost && (
                  <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {activeBoosts.xpBoost.multiplier}x XP Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Question {Math.min(currentQuizIndex + 1, effectiveQuizCount)} of {effectiveQuizCount}
                  </h3>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(Math.min(currentQuizIndex + 1, effectiveQuizCount) / Math.max(1, effectiveQuizCount)) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {renderWithNewlines(currentQuestion?.question)}
                </h3>
              </div>

              <div className="space-y-3 mb-8">
                {currentQuestion?.options?.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={showQuizResult}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? showQuizResult
                          ? index === currentQuestion.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-red-500 bg-red-50 text-red-700"
                          : "border-blue-500 bg-blue-50"
                        : showQuizResult && index === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-medium text-gray-700">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{renderWithNewlines(option)}</span>
                    </div>
                  </button>
                ))}
              </div>

              {showQuizResult && (
                <div
                  className={`p-6 rounded-xl mb-6 ${selectedAnswer === currentQuestion.correctAnswer ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}
                >
                  <p className={`font-bold text-lg mb-2 ${selectedAnswer === currentQuestion.correctAnswer ? "text-green-700" : "text-red-700"}`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? "✓ Correct!" : "✗ Incorrect!"}
                  </p>
                  <p className="text-gray-700">{renderWithNewlines(currentQuestion?.explanation)}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={showQuizResult ? handleQuizQuestionNext : handleQuizNext}
                  disabled={selectedAnswer === null}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <span>
                    {showQuizResult 
                      ? (selectedAnswer === currentQuestion.correctAnswer 
                          ? (currentQuizIndex === effectiveQuizCount - 1 ? "Finish Lesson" : "Next Question")
                          : "Retake Required")
                      : "Check Answer"
                    }
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main lesson view
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 z-50 overflow-y-auto">
      <div className="flex flex-col min-h-screen">
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-6">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{lesson.title}</h2>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-6 flex-wrap">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="hidden sm:flex items-center space-x-1">
                  {Array.from({ length: safeTotalSteps }, (_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < currentStep ? "bg-green-500" : i === currentStep ? "bg-blue-500" : "bg-gray-200"}`} />
                  ))}
                  {effectiveQuizCount > 0 && <div className="w-3 h-3 rounded-full bg-purple-200 ml-1" title="Quiz" />}
                </div>
                <span className="text-xs lg:text-sm font-medium text-gray-700">{Math.min(currentProgressInternal, safeTotalAll)}/{safeTotalAll}</span>
              </div>

              {/* UPDATED: Enhanced hearts display with unlimited hearts indicator */}
              <div className="flex items-center space-x-1 lg:space-x-2">
                <span className="text-xs lg:text-sm text-gray-600 hidden sm:inline">Hearts:</span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-4 h-4 lg:w-5 lg:h-5 ${
                        activeBoosts.unlimitedHearts 
                          ? "text-pink-500 fill-current animate-pulse" 
                          : i < (user?.hearts ?? 0) 
                          ? "text-red-500 fill-current" 
                          : "text-gray-300"
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs lg:text-sm font-medium text-gray-700">
                  {activeBoosts.unlimitedHearts ? '∞' : `${user?.hearts ?? 0}/5`}
                </span>
              </div>
              
              {/* Show active XP boost */}
              {activeBoosts.xpBoost && (
                <div className="hidden lg:flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                  <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-600" />
                  <span className="text-xs lg:text-sm font-medium text-yellow-800">
                    {activeBoosts.xpBoost.multiplier}x XP Active
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs lg:text-sm text-gray-600">Step {Math.min(currentStep + 1, safeTotalSteps)} of {safeTotalSteps}</span>
                <span className="text-xs lg:text-sm text-gray-600">{percent}% Complete</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-8">
              {isCurrentStepQuestion && currentStepData?.question ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs lg:text-sm font-medium text-purple-500 uppercase tracking-wide">Quick Check</h3>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">{renderWithNewlines(currentStepData.question)}</h3>
                  </div>

                  <div className="space-y-3 mb-8">
                    {(currentStepData.options || currentStepData.answers || []).map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        disabled={showQuizResult}
                        className={`w-full p-3 lg:p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                          selectedAnswer === index
                            ? showQuizResult
                              ? index === currentStepData.correctAnswer
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-red-500 bg-red-50 text-red-700"
                              : "border-purple-500 bg-purple-50"
                            : showQuizResult && index === currentStepData.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-100 rounded-full flex items-center justify-center font-medium text-gray-700 text-sm lg:text-base flex-shrink-0">{String.fromCharCode(65 + index)}</span>
                          <span className="font-medium text-sm lg:text-base">{renderWithNewlines(option)}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {showQuizResult && (
                    <div className={`p-4 lg:p-6 rounded-xl mb-6 ${selectedAnswer === currentStepData.correctAnswer ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
                      <p className={`font-bold text-base lg:text-lg mb-2 ${selectedAnswer === currentStepData.correctAnswer ? "text-green-700" : "text-red-700"}`}>{selectedAnswer === currentStepData.correctAnswer ? "✓ Correct!" : "✗ Incorrect!"}</p>
                      <p className="text-gray-700 text-sm lg:text-base">{renderWithNewlines(currentStepData.explanation)}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-6">{renderWithNewlines(currentStepData?.title)}</h3>
                  <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-8">{renderWithNewlines(currentStepData?.content)}</p>

                  {currentStepData?.code && (
                    <div className="bg-gray-900 rounded-xl p-4 lg:p-6 mb-8 overflow-x-auto">
                      <pre className="text-green-400 font-mono text-xs lg:text-sm leading-relaxed">{currentStepData.code}</pre>
                    </div>
                  )}

                  {currentStepData?.explanation && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 lg:p-6 rounded-r-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <p className="text-blue-800 leading-relaxed text-sm lg:text-base">{renderWithNewlines(currentStepData.explanation)}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4 sticky bottom-0 z-10">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={(!isQuizMode && currentStep <= 0)}
                  className="px-4 lg:px-6 py-2 lg:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
                >
                  ← Previous
                </button>

                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Est. {lesson.baselineTime} min</span>
                </div>

                {/* FIXED: Updated next button - always disabled for wrong answers */}
                <button
                  onClick={showQuizResult ? handleQuestionNext : handleNext}
                  disabled={
                    (isCurrentStepQuestion && selectedAnswer === null && !showQuizResult) || 
                    (showQuizResult && selectedAnswer !== currentStepData.correctAnswer)
                  }
                  className="px-4 lg:px-8 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm lg:text-base"
                >
                  <span>
                    {isCurrentStepQuestion && !showQuizResult
                      ? "Check Answer"
                      : showQuizResult
                      ? (selectedAnswer === currentStepData.correctAnswer 
                          ? "Next Step" 
                          : "Retake Required")
                      : currentStep >= safeTotalSteps - 1
                        ? (effectiveQuizCount > 0 ? "Start Final Quiz" : "Finish Lesson")
                        : "Next Step"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonModal;

