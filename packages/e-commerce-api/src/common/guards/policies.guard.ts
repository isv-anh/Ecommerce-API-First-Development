import { JwtPayload } from '@/api/v1/auth/services/jwt-service/types';
import { CaslAbilityFactory } from '@/common/casl/casl-ability.factory';
import {
  CHECK_POLICIES_KEY,
  PolicyRule,
} from '@/common/decorators/check-policies.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext) {
    const policies =
      this.reflector.getAllAndOverride<PolicyRule[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (policies.length === 0) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();

      const payload: JwtPayload = request.payload;

      const ability = await this.caslAbilityFactory.createAppAbility(
        payload?.roles ?? [],
      );

      return policies.every(([action, subject]) =>
        ability.can(action, subject),
      );
    } catch (error) {
      console.error('PoliciesGuard error:', error);
      throw new ForbiddenException('Access denied: insufficient permissions');
    }
  }
}
