export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface IGenreRepository extends IRepository<Genre> {
  findByName(name: string): Promise<Genre | null>;
}

export interface IVideoRepository extends IRepository<Video> {
  // Add specific query methods for smart search
  search(query: { q?: string; genres?: string[]; language?: string; targetAudience?: string; page?: number; limit?: number; sort?: string }): Promise<{ videos: Video[]; total: number }>;
}

export interface IPlaylistRepository extends IRepository<Playlist> {}

import { Genre, Video, Playlist } from '../entities';
