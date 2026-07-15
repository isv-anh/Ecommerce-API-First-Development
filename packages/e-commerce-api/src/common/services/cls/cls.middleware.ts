import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { ClsService } from './cls.service';

@Injectable()
export class ClsMiddleware implements NestMiddleware {
  constructor(private readonly clsService: ClsService) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    void this.clsService.run({}, () => {
      next();
    });
  }
}
