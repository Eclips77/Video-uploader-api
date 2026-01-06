import { Playlist } from '../../domain/entities';
import { IPlaylistRepository } from '../../domain/repositories';
import { FileSystemRepository } from './FileSystemRepository';

export class PlaylistRepository extends FileSystemRepository<Playlist> implements IPlaylistRepository {
  constructor() {
    super('playlists.json');
  }
}
