import { productsService } from '@/servers';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AppError } from '@/events';
import {  } from '@/events/ErrorList';

export async function getProducts(req: Request, res: Response) {
  const { page, pagination } = req.query;

  const products = await productsService.getProducts(
    parseInt(page as string) || 0,
    parseInt(pagination as string) || 25
  );

  res.status(httpStatus.OK).send(products);
}

export async function getProduct(req: Request, res: Response) {
  const { code } = req.params;
  const product = await productsService.getProductById(code);

  if (!product) {
    throw new AppError(CONFLICT_DELETE);
  }

  res.status(httpStatus.OK).send(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const { code } = req.params;

  await productsService.deleteProductById(code);

  res
    .send({ message: `Product ${code} trashed` })
    .status(httpStatus.NO_CONTENT);
}

export async function updateProduct(req: Request, res: Response) {
  const { code } = req.params;
  const product = req.body;

  await productsService.updateProduct(code, product);

  res
    .send({ message: `Product ${code} updated` })
    .status(httpStatus.NO_CONTENT);
}
