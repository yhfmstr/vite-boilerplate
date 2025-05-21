import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage: FC<HomePageProps> = ({ onStartGame }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
        className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20"
      >
        <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
            Red Bubble
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80">
            Test your reflexes and quick thinking!
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6 md:space-y-8 text-white/90">
          <section className="bg-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 text-white flex items-center gap-2">
              <span className="text-blue-400">🎮</span> How to Play
            </h2>
            <ul className="space-y-2 sm:space-y-3 list-none text-sm sm:text-base md:text-lg">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                <span>Tap or click blue bubbles to pop them and score points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-red-400 rounded-full flex-shrink-0"></span>
                <span>Avoid red bubbles - they end the game!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                <span>Don't let blue bubbles fall off screen - you'll lose a life</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-green-400 rounded-full flex-shrink-0"></span>
                <span>Start with 3 lives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-purple-400 rounded-full flex-shrink-0"></span>
                <span>Level up every 10 points</span>
              </li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 text-white flex items-center gap-2">
              <span className="text-blue-400">📈</span> Level Progression
            </h2>
            <ul className="space-y-2 sm:space-y-3 list-none text-sm sm:text-base md:text-lg">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                <span>Level 1: Easy mode - only blue bubbles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                <span>Level 2: 10% red bubbles, faster speed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                <span>Level 3+: More red bubbles, even faster!</span>
              </li>
            </ul>
          </section>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 sm:mt-8">
          <button
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 touch-manipulation shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start Game"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onStartGame();
              }
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg sm:text-xl">🎮</span>
              Start Game
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage; 