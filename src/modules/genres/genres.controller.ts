import { Controller, Get, Post, Body, Param, UsePipes } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto, CreateGenreSchema } from './dto/create-genre.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateGenreSchema))
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }
}
