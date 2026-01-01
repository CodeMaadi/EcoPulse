
import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  isUltimate?: boolean;
}

const INITIAL_TOPICS: QuizTopic[] = [
  { id: 'recycling', title: 'Recycling Master', icon: '♻️', description: 'Test your knowledge on what can and cannot be recycled.' },
  { id: 'climate', title: 'Climate Science', icon: '🌍', description: 'Understand the mechanics of global warming and its effects.' },
  { id: 'ocean', title: 'Ocean Health', icon: '🌊', description: 'Deep dive into marine conservation and plastic pollution.' },
  { id: 'energy', title: 'Renewable Future', icon: '☀️', description: 'Sun, wind, and water: the fuels of tomorrow.' },
  { id: 'ultimate', title: 'The Ultimate Challenge', icon: '🏆', description: 'A massive 50-question test covering everything! For true Earth Heroes.', isUltimate: true }
];

interface QuizProps {
  onEarnCoins: (amount: number) => void;
  isKidMode?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ onEarnCoins, isKidMode }) => {
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchQuestions = async (topic: QuizTopic) => {
    setLoadingQuestions(true);
    try {
      const count = topic.isUltimate ? 50 : (isKidMode ? 3 : 5);
      const newQuestions = await generateQuizQuestions(topic.title, isKidMode, count);
      setQuestions(newQuestions);
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleTopicSelect = async (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    await fetchQuestions(topic);
  };

  const handleAnswerSelect = (index: number) => {
    if (isAnswered || !questions.length) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      onEarnCoins(isKidMode ? 15 : 10);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    if (selectedTopic) {
      handleTopicSelect(selectedTopic);
    }
  };

  if (!selectedTopic) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className={`text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
            {isKidMode ? 'Earth Trivia! 🧩' : 'Eco-Quiz'}
          </h2>
          <p className={`${isKidMode ? 'text-sky-600 font-bold' : 'text-stone-500 text-lg'}`}>
            Challenge yourself and learn. {isKidMode ? 'Earn 15 Stars' : 'Earn 10 coins'} for every correct answer!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className={`group p-8 bg-white rounded-[2.5rem] border-4 transition-all text-left flex flex-col items-start gap-4 ${
                topic.isUltimate 
                  ? isKidMode ? 'border-yellow-200 bg-yellow-50/30' : 'border-amber-200 bg-amber-50/30'
                  : ''
              } ${
                isKidMode ? 'border-sky-50 hover:border-sky-400' : 'border-stone-100 hover:border-emerald-500 hover:shadow-xl'
              }`}
            >
              <div className="flex justify-between w-full">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {topic.icon}
                </span>
                {topic.isUltimate && (
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${isKidMode ? 'bg-yellow-400 text-white' : 'bg-amber-500 text-white'}`}>
                    Marathon
                  </span>
                )}
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>{topic.title}</h3>
                <p className={`${isKidMode ? 'text-sky-600' : 'text-stone-500'} text-sm leading-relaxed`}>{topic.description}</p>
              </div>
              <div className={`mt-auto pt-4 flex items-center gap-2 font-bold text-sm ${isKidMode ? 'text-sky-500' : 'text-emerald-600'}`}>
                {isKidMode ? 'Play!' : 'Start Quiz'} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-6">
        <div className="text-8xl animate-bounce">{selectedTopic.isUltimate ? '🏆' : isKidMode ? '🤖' : '🔬'}</div>
        <div className="text-center max-w-md mx-auto">
          <h3 className={`text-2xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
            {selectedTopic.isUltimate 
              ? (isKidMode ? 'Preparing the Big Challenge!' : 'Synthesizing the Ultimate Marathon...') 
              : (isKidMode ? 'Leafy is thinking of new questions...' : 'Gemini is generating dynamic challenge...')}
          </h3>
          <p className="text-stone-400 font-medium mt-2">
            {selectedTopic.isUltimate 
              ? "This is a big 50-question set, so it takes a moment to get everything perfect!" 
              : "Preparing fresh environmental tests..."}
          </p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className={`max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 text-center animate-in zoom-in-95 duration-500 ${isKidMode ? 'border-sky-100' : 'border-stone-100'}`}>
        <div className="text-6xl mb-6">
          {percentage === 100 ? '👑' : percentage >= 80 ? '🌟' : percentage >= 50 ? '🌱' : '📚'}
        </div>
        <h2 className={`text-3xl font-black mb-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {selectedTopic.isUltimate ? 'Ultimate Legend!' : isKidMode ? 'Quest Complete!' : 'Quiz Finished!'}
        </h2>
        <p className="text-stone-500 mb-4">You scored {score} out of {totalQuestions}</p>
        <div className={`inline-block px-6 py-3 rounded-2xl border mb-8 ${isKidMode ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
           <span className="font-black">{isKidMode ? 'Bonus Stars: ✨' : 'Total Earned: 🪙'} {score * (isKidMode ? 15 : 10)}</span>
        </div>
        
        <div className={`p-8 rounded-[2rem] mb-8 ${isKidMode ? 'bg-sky-50 text-sky-900' : 'bg-stone-50 text-stone-800'}`}>
          <div className={`text-5xl font-black mb-2 ${isKidMode ? 'text-sky-500' : 'text-emerald-600'}`}>{percentage}%</div>
          <p className="font-bold">
            {percentage === 100 
              ? (isKidMode ? "You're a True Legend! 🏆🌈" : "Incredible! Master status achieved.") 
              : percentage >= 80
              ? (isKidMode ? "Wow, a real Expert! ⭐" : "Excellent performance!")
              : percentage >= 50 
              ? (isKidMode ? "Great job friend! 🌿" : "Strong knowledge base. Keep going!") 
              : (isKidMode ? "Let's learn more together! 📖" : "Good effort. Every fact counts.")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className={`px-8 py-4 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95 ${
              isKidMode ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
            }`}
          >
            {isKidMode ? 'New Questions! 🚀' : 'Retry (Fresh Set)'}
          </button>
          <button
            onClick={() => setSelectedTopic(null)}
            className={`px-8 py-4 rounded-2xl font-bold transition-colors ${
              isKidMode ? 'bg-sky-50 text-sky-800 hover:bg-sky-100' : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
            }`}
          >
            Switch Topic
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="text-stone-400 hover:text-stone-800 transition-colors flex items-center gap-2 font-black text-sm uppercase"
        >
          ← Quit Quest
        </button>
        <div className={`font-black text-sm uppercase tracking-widest flex items-center gap-2 ${isKidMode ? 'text-sky-500' : 'text-amber-600'}`}>
          {isKidMode ? 'Reward: ✨' : 'Potential: 🪙'} {(questions.length - currentQuestionIndex) * (isKidMode ? 15 : 10)}
        </div>
      </div>

      <div className={`bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 ${isKidMode ? 'border-sky-100' : 'border-stone-100'}`}>
        <div className="mb-8 flex items-center justify-between">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isKidMode ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-700'}`}>
            {selectedTopic.isUltimate && '🏆 '} Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          {/* Progress bar instead of dots for marathon tests */}
          {questions.length > 10 ? (
            <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isKidMode ? 'bg-sky-500' : 'bg-emerald-500'}`}
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          ) : (
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentQuestionIndex ? (isKidMode ? 'bg-sky-500' : 'bg-emerald-500') : 'bg-stone-200'}`}></div>
              ))}
            </div>
          )}
        </div>

        <h3 className={`text-2xl font-black mb-8 leading-tight ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.correctAnswer;
            const isSelected = idx === selectedAnswer;
            
            let btnClass = "w-full p-6 text-left rounded-[1.5rem] border-2 transition-all font-bold flex items-center justify-between group ";
            
            if (!isAnswered) {
              btnClass += isKidMode 
                ? "border-sky-50 hover:border-sky-400 hover:bg-sky-50 text-sky-900" 
                : "border-stone-100 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700";
            } else if (isCorrect) {
              btnClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
            } else if (isSelected) {
              btnClass += "border-red-500 bg-red-50 text-red-900";
            } else {
              btnClass += "border-transparent text-stone-400 opacity-40";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <span className="font-black text-emerald-600">{isKidMode ? '+15 ✨' : '+10 🪙'}</span>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-10 p-8 rounded-[2rem] border-2 animate-in slide-in-from-top-2 ${isKidMode ? 'bg-yellow-50 border-yellow-200 text-yellow-900' : 'bg-amber-50 border-amber-100 text-amber-900'}`}>
            <p className="text-sm">
              <span className="font-black block mb-2 uppercase tracking-widest text-xs opacity-60">{isKidMode ? 'The Magic Truth!' : 'Scientific Insight'}</span>
              <span className="font-medium leading-relaxed">{currentQuestion.explanation}</span>
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className={`px-10 py-5 rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
              isAnswered 
                ? isKidMode ? 'bg-sky-500 text-white' : 'bg-emerald-600 text-white' 
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? (isKidMode ? 'See Star Score!' : 'See Results') : 'Next Question'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
