// src/music/music.service.ts

import { Injectable } from '@nestjs/common';
import { Music } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MusicsService {
    constructor(private prisma: PrismaService) { }

    async create(title: string, filePath: string) {
        return this.prisma.music.create({
            data: {
                title,
                filePath,
            },
        });
    }

    async findAll(skip?: number, take?: number): Promise<Music[]> {
        return this.prisma.music.findMany({
            skip,
            take,
        });
    }

    async remove(id: string) {
        return this.prisma.music.delete({
            where: { id },
        });
    }
}