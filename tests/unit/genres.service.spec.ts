import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from '../../src/modules/genres/genres.service';
import { getModelToken } from '@nestjs/mongoose';
import { Genre } from '../../src/modules/genres/schemas/genre.schema';

const mockGenre = {
  _id: 'genre-id',
  name: 'Action',
  save: jest.fn().mockResolvedValue({ _id: 'genre-id', name: 'Action' }),
};

const mockGenreModel = {
  new: jest.fn().mockResolvedValue(mockGenre),
  constructor: jest.fn().mockResolvedValue(mockGenre),
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('GenresService', () => {
  let service: GenresService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getModelToken(Genre.name),
          useValue: mockGenreModel,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    model = module.get(getModelToken(Genre.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const result = [mockGenre];
      model.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });

      const genres = await service.findAll();
      expect(genres).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single genre', async () => {
        model.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockGenre),
        });
        const genre = await service.findOne('genre-id');
        expect(genre).toEqual(mockGenre);
    });
  });
});
