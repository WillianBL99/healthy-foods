import { ProductDB } from '@/interfaces';
import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';

const product: ProductDB = {
  _id: new ObjectId(faker.database.mongodbObjectId()),
  brands: faker.commerce.productName(),
  categories: faker.commerce.product(),
  cities: faker.word.conjunction(),
  code: faker.random.numeric(13),
  created_t: new Date(faker.date.past(10)),
  creator: faker.name.firstName(),
  image_url: faker.image.imageUrl(),
  imported_t: new Date(faker.date.past(10)),
  ingredients_text: faker.lorem.sentence(),
  labels: faker.lorem.sentence(),
  last_modified_t: new Date(faker.date.past(10)),
  main_category: faker.commerce.department(),
  nutriscore_grade: faker.word.conjunction(),
  nutriscore_score: faker.random.numeric(2),
  product_name: faker.commerce.productName(),
  purchase_places: faker.random.locale(),
  quantity: faker.random.numeric(2),
  serving_quantity: faker.random.numeric(2),
  serving_size: faker.random.numeric(2),
  status: faker.helpers.arrayElement(['published', 'draft', 'trash']),
  stores: faker.random.locale(),
  traces: faker.lorem.sentence(),
  url: faker.internet.url(),
};

function getProducts(_page: number = 0, pagination: number = 25): ProductDB[] {
  const listProducts: ProductDB[] = [];
  for (let i = 0; i < pagination; i++) {
    listProducts.push(product);
  }
  return listProducts;
}

const productFactory = {
  getProducts,
};

export { productFactory };
