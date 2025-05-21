export type BubbleType = 'blue' | 'red';

export interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: BubbleType;
  isAlive: boolean;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  isPlaying: boolean;
  isGameOver: boolean;
  bubbles: Bubble[];
}

export interface GameConfig {
  initialLives: number;
  bubbleSpawnInterval: number;
  baseSpeed: number;
  speedIncrease: number;
  redBubblePercentage: number;
  bubbleSizeRange: {
    min: number;
    max: number;
  };
} 