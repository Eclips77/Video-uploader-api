import { Controller, Get, Post, Body, Param, UsePipes, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { CreateVideoDto, CreateVideoSchema } from './dto/create-video.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ZodValidationPipe(CreateVideoSchema))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.videosService.create(file, createVideoDto);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }
}
