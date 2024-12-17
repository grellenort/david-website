import {Product} from './Product.ts';
import {Meta} from '../../common/pagination/meta.ts';

export interface ProductFilterResponseDto {
  data: Array<Product>;
  meta: Meta;
}
