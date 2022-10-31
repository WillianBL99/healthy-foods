import { Product } from "@/interfaces";
import { productsRepository } from "@/repositories";
import { WithId } from "mongodb";

async function getProducts(page: number, pagination: number): Promise<WithId<Product>[]> {
  return await productsRepository.getProducts(page, pagination);
}

const productsService = {
  getProducts,
};

export { productsService };