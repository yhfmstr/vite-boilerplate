import { FC } from 'react';

interface GameOverProps {
  score: number;
  onPlayAgain: () => void;
}

const GameOver: FC<GameOverProps> = ({ score, onPlayAgain }) => {
  const handleShare = () => {
    // For now, just log to console
    console.log('Share functionality to be implemented');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Game Over!</h2>
        <p className="text-xl md:text-2xl text-white/90 mb-8">Your Score: {score}</p>
        
        <div className="space-y-4">
          <button
            onClick={onPlayAgain}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 touch-manipulation"
            aria-label="Play Again"
          >
            Play Again
          </button>
          
          <button
            onClick={handleShare}
            className="w-full bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 touch-manipulation"
            aria-label="Share Score"
          >
            Share Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver; 