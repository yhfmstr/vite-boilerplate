import { FC, useEffect, useRef, useState } from 'react';
import { Bubble, GameState, GameConfig } from '../types/game';

const GAME_CONFIG: GameConfig = {
  initialLives: 3,
  bubbleSpawnInterval: 800,
  baseSpeed: 1.5,
  speedIncrease: 0.3,
  redBubblePercentage: 0,
  bubbleSizeRange: {
    min: 30,
    max: 50,
  },
};

const Game: FC<{
  onGameOver: (score: number) => void;
}> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: GAME_CONFIG.initialLives,
    level: 1,
    isPlaying: true,
    isGameOver: false,
    bubbles: [],
  });

  const animationFrameRef = useRef<number>();
  const lastSpawnTimeRef = useRef<number>(0);
  const devicePixelRatioRef = useRef<number>(window.devicePixelRatio || 1);
  const bubblesRef = useRef<Bubble[]>([]);
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(GAME_CONFIG.initialLives);
  const levelRef = useRef<number>(1);

  const generateBubble = (): Bubble => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');

    const size = Math.random() * (GAME_CONFIG.bubbleSizeRange.max - GAME_CONFIG.bubbleSizeRange.min) + GAME_CONFIG.bubbleSizeRange.min;
    const maxX = (canvas.width / devicePixelRatioRef.current) - size;
    const x = Math.random() * maxX;
    
    // Calculate red bubble probability based on level
    let redProbability = 0;
    if (levelRef.current === 1) {
      redProbability = 0;
    } else if (levelRef.current === 2) {
      redProbability = 0.1;
    } else {
      // Level 3+: Random between 20-40%
      redProbability = 0.2 + (Math.random() * 0.2);
    }
    
    const type = Math.random() < redProbability ? 'red' : 'blue';
    
    // Add subtle speed variation to each bubble (±20% of the base speed)
    const speedVariation = 0.8 + (Math.random() * 0.4); // Range: 0.8 to 1.2
    const baseSpeed = GAME_CONFIG.baseSpeed + (levelRef.current - 1) * GAME_CONFIG.speedIncrease;
    const speed = baseSpeed * speedVariation;

    return {
      id: Date.now() + Math.random(),
      x,
      y: -size,
      size,
      speed,
      type,
      isAlive: true,
    };
  };

  const handleBubbleClick = (bubble: Bubble) => {
    if (!bubble.isAlive) return;

    if (bubble.type === 'red') {
      setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
      return;
    }

    // Increment score and mark bubble as not alive
    bubblesRef.current = bubblesRef.current.map(b => 
      b.id === bubble.id ? { ...b, isAlive: false } : b
    );
    
    scoreRef.current += 1;
    const newLevel = Math.floor(scoreRef.current / 10) + 1;
    
    if (newLevel !== levelRef.current) {
      levelRef.current = newLevel;
    }
    
    setGameState(prev => ({
      ...prev,
      score: scoreRef.current,
      level: levelRef.current,
      bubbles: bubblesRef.current,
    }));
  };

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width * devicePixelRatioRef.current);
    const scaleY = canvas.height / (rect.height * devicePixelRatioRef.current);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleInteraction = (clientX: number, clientY: number) => {
    if (!gameState.isPlaying) return;

    const { x, y } = getCanvasCoordinates(clientX, clientY);

    bubblesRef.current.forEach(bubble => {
      if (!bubble.isAlive) return;

      const dx = x - (bubble.x + bubble.size / 2);
      const dy = y - (bubble.y + bubble.size / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= bubble.size / 2) {
        handleBubbleClick(bubble);
      }
    });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.changedTouches[0];
    handleInteraction(touch.clientX, touch.clientY);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleInteraction(e.clientX, e.clientY);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    devicePixelRatioRef.current = dpr;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set canvas dimensions accounting for device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Set canvas style dimensions
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale context to account for device pixel ratio
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Set initial background
      ctx.fillStyle = 'rgb(30, 58, 138)'; // blue-900
      ctx.fillRect(0, 0, width, height);
    }
  };

  const updateGame = (timestamp: number) => {
    if (!gameState.isPlaying) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Spawn new bubbles
    if (timestamp - lastSpawnTimeRef.current > GAME_CONFIG.bubbleSpawnInterval) {
      const newBubble = generateBubble();
      bubblesRef.current = [...bubblesRef.current, newBubble];
      lastSpawnTimeRef.current = timestamp;
    }

    // Identify bubbles that fell off screen
    const canvasHeight = canvas.height / devicePixelRatioRef.current;
    let lostBlueBubbles = 0;
    
    // Update bubble positions and check for bubbles off screen
    const updatedBubbles = bubblesRef.current
      .filter(bubble => bubble.isAlive)
      .map(bubble => {
        const newY = bubble.y + bubble.speed;
        
        // Check if bubble is now off-screen
        if (newY > canvasHeight && bubble.type === 'blue') {
          lostBlueBubbles++;
          return { ...bubble, isAlive: false }; // Mark as not alive
        }
        
        return { ...bubble, y: newY };
      })
      .filter(bubble => bubble.isAlive); // Keep only alive bubbles
    
    bubblesRef.current = updatedBubbles;
    
    // Update lives if any bubbles fell off screen
    if (lostBlueBubbles > 0) {
      livesRef.current = Math.max(0, livesRef.current - lostBlueBubbles);
      
      // Check for game over
      if (livesRef.current <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          lives: 0,
          isGameOver: true, 
          isPlaying: false 
        }));
        return;
      }
    }
    
    // Update state
    setGameState(prev => ({
      ...prev,
      bubbles: bubblesRef.current,
      lives: livesRef.current,
      score: scoreRef.current,
      level: levelRef.current,
    }));

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create sophisticated animated background
    const time = timestamp * 0.001; // Convert to seconds for smoother animation

    // Draw main background gradient
    const mainGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / devicePixelRatioRef.current);
    mainGradient.addColorStop(0, '#0f172a'); // slate-900
    mainGradient.addColorStop(0.5, '#1e293b'); // slate-800
    mainGradient.addColorStop(1, '#0f172a'); // slate-900
    ctx.fillStyle = mainGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw animated radial gradient overlay
    const centerX = canvas.width / (2 * devicePixelRatioRef.current);
    const centerY = canvas.height / (2 * devicePixelRatioRef.current);
    const radius = Math.max(canvas.width, canvas.height) / devicePixelRatioRef.current;
    
    const radialGradient = ctx.createRadialGradient(
      centerX + Math.sin(time * 0.5) * 50,
      centerY + Math.cos(time * 0.5) * 50,
      0,
      centerX,
      centerY,
      radius
    );
    
    radialGradient.addColorStop(0, 'rgba(30, 41, 59, 0.8)'); // slate-800 with opacity
    radialGradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.4)'); // slate-900 with opacity
    radialGradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)'); // slate-900 with opacity
    
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle particle effect
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(time + i) * canvas.width / devicePixelRatioRef.current) % canvas.width;
      const y = (Math.cos(time + i) * canvas.height / devicePixelRatioRef.current) % canvas.height;
      const size = Math.sin(time + i) * 2 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148, 163, 184, ${0.1 + Math.sin(time + i) * 0.05})`; // slate-400 with varying opacity
      ctx.fill();
    }

    // Draw bubbles with enhanced effects
    bubblesRef.current.forEach(bubble => {
      if (!bubble.isAlive) return;
      
      // Draw bubble glow
      const glowGradient = ctx.createRadialGradient(
        bubble.x + bubble.size / 2,
        bubble.y + bubble.size / 2,
        0,
        bubble.x + bubble.size / 2,
        bubble.y + bubble.size / 2,
        bubble.size
      );
      
      const bubbleColor = bubble.type === 'red' ? '#ef4444' : '#3b82f6'; // red-500 : blue-500
      glowGradient.addColorStop(0, `${bubbleColor}40`); // 25% opacity
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2, bubble.size, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
      
      // Draw bubble shadow
      ctx.beginPath();
      ctx.arc(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2, bubble.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();
      
      // Draw bubble
      ctx.beginPath();
      ctx.arc(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2, bubble.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = bubbleColor;
      ctx.fill();
      
      // Draw bubble highlight
      ctx.beginPath();
      ctx.arc(
        bubble.x + bubble.size / 3,
        bubble.y + bubble.size / 3,
        bubble.size / 6,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
      
      // Draw bubble border
      ctx.beginPath();
      ctx.arc(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2, bubble.size / 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw UI with improved visibility
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / (2 * devicePixelRatioRef.current), 40);
    ctx.fillText(`Level: ${levelRef.current}`, canvas.width / (2 * devicePixelRatioRef.current), 70);
    ctx.fillText(`Lives: ${livesRef.current}`, canvas.width / (2 * devicePixelRatioRef.current), 100);
    ctx.shadowBlur = 0;

    animationFrameRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    // Initialize refs with starting values
    scoreRef.current = gameState.score;
    livesRef.current = gameState.lives;
    levelRef.current = gameState.level;
    
    // Start the game loop
    lastSpawnTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState.isGameOver) {
      onGameOver(gameState.score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.isGameOver]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        className="absolute inset-0 w-full h-full"
        style={{ 
          touchAction: 'none',
          zIndex: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1e3a8a' // blue-900
        }}
      />
      <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 text-center text-white font-bold text-2xl p-4">
          Score: {gameState.score} | Level: {gameState.level} | Lives: {gameState.lives}
        </div>
      </div>
    </div>
  );
};

export default Game; 