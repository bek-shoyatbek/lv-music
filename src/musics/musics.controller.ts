import { Controller, Get, Post, Body, Param, Delete, Render, UseInterceptors, UploadedFile, Res, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { MusicsService } from './musics.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { diskStorage } from 'multer';

const AUDIO_MIME_TYPES = ["audio/aac", "audio/midi", "audio/ogg", "audio/wav"]
@Controller('music')
export class MusicsController {
  constructor(private readonly musicService: MusicsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {

    fileFilter(req, file, cb) {
      // Check if the file is an audio file and size is less than 5MB
      if (AUDIO_MIME_TYPES.includes(file.mimetype) && file.size < 1024 * 1024 * 10) {
        //correct format
        return cb(null, true);
      } else {
        //wrong format
        return cb(null, false);
      }
    },
    storage: diskStorage({
      destination: 'public',

      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(12).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${path.extname(file.originalname)}`)
      },

    }),
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body('title') title: string, @Res() res: Response) {
    try {
      console.log("File", file)
      const music = await this.musicService.create(title, file.filename);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Music uploaded successfully',
        music,
      });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to upload music',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(@Query('skip', new ParseIntPipe({ optional: true })) skip?: number, @Query("take", new ParseIntPipe({ optional: true })) take?: number) {
    return this.musicService.findAll(skip, take);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.musicService.remove(id);
  }


  @Get('upload')
  @Render('upload')
  uploadForm() {
    return {};
  }

  @Get('list')
  @Render('list')
  async list() {
    const music = await this.musicService.findAll();

    return { music };
  }
}