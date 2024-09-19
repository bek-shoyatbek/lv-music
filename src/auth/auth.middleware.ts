import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) { }
    use(req: Request, res: Response, next: NextFunction) {
        const { login, password } = req.query;

        if (
            login === this.configService.get('LOGIN') &&
            password === this.configService.get('PASSWORD')
        ) {
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
}