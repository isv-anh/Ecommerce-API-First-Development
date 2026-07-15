import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import type { JwtPayload } from '@/api/v1/auth/services/jwt-service/types';

export interface ClsStore {
  userId?: string;
  payload?: JwtPayload;
}

@Injectable()
export class ClsService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<ClsStore>();

  run<T>(store: ClsStore, callback: () => T): T {
    return this.asyncLocalStorage.run(store, callback);
  }

  getStore(): ClsStore | undefined {
    return this.asyncLocalStorage.getStore();
  }

  get userId(): string | undefined {
    return this.getStore()?.userId;
  }

  get payload(): JwtPayload | undefined {
    return this.getStore()?.payload;
  }
}
