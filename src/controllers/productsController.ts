import AppError from '@/config/error';
import { productsService } from '@/servers';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

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
  console.log({ code }, 'code');
  const product = await productsService.getProductById(code);

  if (!product) {
    throw new AppError(
      'Product not found',
      httpStatus.NOT_FOUND,
      'Product not found',
      'verify if the product exists or if the code is correct'
    );
  }

  res.status(httpStatus.OK).send(product);
}
