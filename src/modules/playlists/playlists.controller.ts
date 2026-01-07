import { Controller, Get, Post, Body, Param, UsePipes } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto, CreatePlaylistSchema } from './dto/create-playlist.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreatePlaylistSchema))
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsService.create(createPlaylistDto);
  }

  @Get()
  findAll() {
    return this.playlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(id);
  }
}
