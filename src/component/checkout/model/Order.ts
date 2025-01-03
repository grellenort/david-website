import {OrderItem} from './OrderItem.ts';
import {OrderAddress} from "./OrderAddress.ts";


export enum PaymentType {
  CREDIT_CARD,
  BANK_TRANSFER
}

export interface Order {
  email: string;
  paymentType: PaymentType
  items: Array<OrderItem>;
  billingAddress: OrderAddress;
  shippingAddress: OrderAddress;
  billingAsShipping: boolean;
}
