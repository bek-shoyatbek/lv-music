import { Module } from '@nestjs/common';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';


@Module({
  controllers: [MusicsController],
  providers: [MusicsService, PrismaService, ConfigService],
})
export class MusicsModule { }