import { Module } from '@nestjs/common';

import { CustomerAddressesController } from './customer-addresses.controller';
import { CustomerAddressesService } from './customer-addresses.service';

import {
  BaseCustomerAddressesController,
  CUSTOMER_ADDRESSES_CONTROLLER,
} from '@generated-controller/customer/customer-addresses/base-customer-addresses.controller';
import { CustomerAddressesRepository } from '@/api/v1/customer/customer-addresses/customer-addresses.repository';

@Module({
  controllers: [BaseCustomerAddressesController],
  providers: [
    CustomerAddressesService,
    {
      provide: CUSTOMER_ADDRESSES_CONTROLLER,
      useClass: CustomerAddressesController,
    },
    CustomerAddressesRepository,
  ],
})
export class CustomerAddressesModule {}
