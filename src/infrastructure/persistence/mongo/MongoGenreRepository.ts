import { IGenreRepository } from '../../../domain/repositories';
import { Genre } from '../../../domain/entities';
import { MongoRepository } from './MongoRepository';
import { GenreModel, IGenreModel } from './schemas/Genre';

export class MongoGenreRepository extends MongoRepository<Genre, IGenreModel> implements IGenreRepository {
  constructor() {
    super(GenreModel);
  }

  async findByName(name: string): Promise<Genre | null> {
    const doc = await this.model.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    return doc ? (doc.toJSON() as Genre) : null;
  }
}
