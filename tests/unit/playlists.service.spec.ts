import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsService } from '../../src/modules/playlists/playlists.service';
import { getModelToken } from '@nestjs/mongoose';
import { Playlist } from '../../src/modules/playlists/schemas/playlist.schema';

const mockPlaylist = {
  _id: 'playlist-id',
  name: 'My Playlist',
  videoIds: [],
};

const mockPlaylistModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

describe('PlaylistsService', () => {
  let service: PlaylistsService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        {
          provide: getModelToken(Playlist.name),
          useValue: mockPlaylistModel,
        },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
    model = module.get(getModelToken(Playlist.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all playlists', async () => {
        model.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([mockPlaylist]),
        });
        const result = await service.findAll();
        expect(result).toEqual([mockPlaylist]);
    });
  });
});
