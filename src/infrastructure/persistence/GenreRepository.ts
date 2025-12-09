import { Genre } from '../../domain/entities';
import { IGenreRepository } from '../../domain/repositories';
import { FileSystemRepository } from './FileSystemRepository';

export class GenreRepository extends FileSystemRepository<Genre> implements IGenreRepository {
  constructor() {
    super('genres.json');
  }

  async findByName(name: string): Promise<Genre | null> {
    const genres = await this.readAll();
    return genres.find((genre) => genre.name.toLowerCase() === name.toLowerCase()) || null;
  }
}
