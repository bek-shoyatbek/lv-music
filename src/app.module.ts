import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicsModule } from './musics/musics.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MusicsModule,
    MulterModule.register({
      dest: './public',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
