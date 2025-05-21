import { useState } from 'react'
import HomePage from './components/HomePage'
import Game from './components/Game'
import GameOver from './components/GameOver'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<'home' | 'playing' | 'gameOver'>('home')
  const [finalScore, setFinalScore] = useState(0)

  const handleStartGame = () => {
    setGameState('playing')
  }

  const handleGameOver = (score: number) => {
    setFinalScore(score)
    setGameState('gameOver')
  }

  const handlePlayAgain = () => {
    setGameState('playing')
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
      {gameState === 'home' && <HomePage onStartGame={handleStartGame} />}
      {gameState === 'playing' && <Game onGameOver={handleGameOver} />}
      {gameState === 'gameOver' && (
        <GameOver score={finalScore} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  )
}

export default App
