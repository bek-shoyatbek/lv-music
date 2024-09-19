// src/music/music.service.ts

import { Injectable } from '@nestjs/common';
import { Music } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';

@Injectable()
export class MusicsService {
    constructor(private prisma: PrismaService) { }

    async create(title: string, filePath: string) {
        const music = await this.prisma.music.create({
            data: {
                title,
                filePath,
            },
        });

        return music;
    }

    async findAll(skip?: number, take?: number): Promise<Music[]> {
        return this.prisma.music.findMany({
            skip,
            take,
        });
    }

    async remove(id: string) {
        // Delete file as well
        const file = await this.prisma.music.findUnique({
            where: { id },
        });

        if (!file) {
            throw new Error('File not found');
        }
        await this.prisma.music.delete({
            where: { id },
        });
        // Delete file
        const filePath = `public/${file.filePath}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

    }
}