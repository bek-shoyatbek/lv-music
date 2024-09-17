import { Module } from '@nestjs/common';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { PrismaService } from 'src/prisma.service';


@Module({
  controllers: [MusicsController],
  providers: [MusicsService, PrismaService],
})
export class MusicsModule { }