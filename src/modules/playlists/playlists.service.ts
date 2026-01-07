import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(@InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const createdPlaylist = new this.playlistModel(createPlaylistDto);
    return createdPlaylist.save();
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistModel.find().populate('videoIds').exec();
  }

  async findOne(id: string): Promise<Playlist | null> {
    return this.playlistModel.findById(id).populate('videoIds').exec();
  }
}
