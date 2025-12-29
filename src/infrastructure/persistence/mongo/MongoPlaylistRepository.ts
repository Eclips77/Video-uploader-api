import { IPlaylistRepository } from '../../../domain/repositories';
import { Playlist } from '../../../domain/entities';
import { MongoRepository } from './MongoRepository';
import { PlaylistModel, IPlaylistModel } from './schemas/Playlist';

export class MongoPlaylistRepository extends MongoRepository<Playlist, IPlaylistModel> implements IPlaylistRepository {
  constructor() {
    super(PlaylistModel);
  }
}
