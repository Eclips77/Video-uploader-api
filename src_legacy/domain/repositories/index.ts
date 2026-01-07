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

export interface SearchParams {
  filter?: Record<string, any>; // Key-value exact matches or complex objects
  textSearch?: string; // For fuzzy search
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IVideoRepository extends IRepository<Video> {
  search(params: SearchParams): Promise<{ videos: Video[]; total: number }>;
}

export interface IPlaylistRepository extends IRepository<Playlist> {}

import { Genre, Video, Playlist } from '../entities';
export { Genre, Video, Playlist };
