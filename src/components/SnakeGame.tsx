import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, GAME_SPEED } from '../constants';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(Direction.UP);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isGameOver, isPaused, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex justify-between w-full items-center">
        <h2 className="text-2xl font-bold text-cyan-400 tracking-widest uppercase italic">Snake Protocol</h2>
        <div className="text-right">
          <p className="text-xs text-cyan-500/60 uppercase tracking-tighter">Score</p>
          <p className="text-3xl font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            {score.toString().padStart(4, '0')}
          </p>
        </div>
      </div>

      <div 
        className="relative bg-slate-900 border-2 border-cyan-500/20 rounded-lg overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`rounded-sm ${i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-600/80'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="bg-rose-500 rounded-full shadow-[0_0_15px_#f43f5e] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <h3 className="text-4xl font-black text-rose-500 mb-4 tracking-tighter italic">SYSTEM FAILURE</h3>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            >
              REBOOT
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-sm">
            <button 
              onClick={() => setIsPaused(false)}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-black border-b-[12px] border-b-transparent ml-1" />
              </div>
              <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Resume</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 text-[10px] text-cyan-500/40 uppercase font-mono">
        <span>[Arrows] Move</span>
        <span>[Space] Pause</span>
      </div>
    </div>
  );
};

export default SnakeGame;
