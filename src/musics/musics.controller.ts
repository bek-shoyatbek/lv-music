import { Controller, Get, Post, Body, Param, Delete, Render, UseInterceptors, UploadedFile, Res, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { MusicsService } from './musics.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

const AUDIO_MIME_TYPES = ["audio/aac", "audio/midi", "audio/ogg", "audio/wav", "audio/x-m4a"]
@Controller('music')
export class MusicsController {
  constructor(private readonly musicService: MusicsService, private configService: ConfigService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {

    fileFilter(req, file, cb) {
      // File size should be 
      if (file?.size && (file.size > 1024 * 1024 * 10)) {
        return cb(null, false);
      }

      // Accept audio only
      if (!AUDIO_MIME_TYPES.includes(file.mimetype)) {
        return cb(null, false);
      }

      return cb(null, true);
    },
    storage: diskStorage({
      destination: 'public',

      filename: (req, file, cb) => {
        // Generating a 12 random chars long string
        const randomName = Array(12).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${path.extname(file.originalname)}`)
      },

    }),
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body('title') title: string, @Res() res: Response, @Query("login") login?: string, @Query("pass") password?: string) {
    try {
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

    return { music, skip: 0, take: 10, totalMusicCount: music.length };
  }
}