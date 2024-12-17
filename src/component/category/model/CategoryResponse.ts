import {Category} from './Category.ts';

export class CategoryResponse {
  data: Array<Category>;

  constructor(category: Array<Category>) {
    this.data = category;
  }
}
