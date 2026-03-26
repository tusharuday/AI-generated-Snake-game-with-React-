export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export type Point = { x: number; y: number };

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}
