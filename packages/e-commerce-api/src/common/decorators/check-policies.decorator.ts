import { AppAbility } from '@/common/casl/casl-ability.factory';
import { SetMetadata } from '@nestjs/common';

export type PolicyRule = Parameters<AppAbility['can']>;

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = (permissions: PolicyRule[]) =>
  SetMetadata(CHECK_POLICIES_KEY, permissions);
