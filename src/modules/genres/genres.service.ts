import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(@InjectModel(Genre.name) private genreModel: Model<GenreDocument>) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const createdGenre = new this.genreModel(createGenreDto);
    return createdGenre.save();
  }

  async findAll(): Promise<Genre[]> {
    return this.genreModel.find().exec();
  }

  async findOne(id: string): Promise<Genre | null> {
    return this.genreModel.findById(id).exec();
  }
}
