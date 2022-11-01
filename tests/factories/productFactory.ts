import { ProductDB } from '@/interfaces';
import { ObjectId } from 'mongodb';

const products: ProductDB[] = [
  {
    _id: new ObjectId('5f9f1b9b9c9d9c0b8c0b9b9b'),
    brands: 'coca fanta',
    categories: 'bebidas',
    cities: 'bogota',
    code: '200',
    created_t: 1602000000,
    creator: 'some user',
    image_url:
      'https://static.openfoodfacts.org/images/products/200/000/000/0000/front_fr.3.400.jpg',
    imported_t: 1602000000,
    ingredients_text: 'agua, azucar, gas',
    labels: 'coca cola',
    last_modified_t: 1602000000,
    main_category: 'bebidas',
    nutriscore_grade: 'a',
    nutriscore_score: '1',
    product_name: 'coca cola',
    purchase_places: 'bogota',
    quantity: '1',
    serving_quantity: '1',
    serving_size: '1',
    status: 'publisher',
    stores: 'coca cola',
    traces: 'coca cola',
    url: 'https://static.openfoodfacts.org/images/products/200/000/000/0000/front_fr.3.400.jpg',
  },
];

function getProducts(): ProductDB[] {
  return products;
}

const productFactory = {
  getProducts,
};

export { productFactory };
