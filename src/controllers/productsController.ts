import { productsService } from "@/servers";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getProducts(req: Request, res: Response) {
  const { page, pagination } = req.query;

  const products = await productsService.getProducts(
    parseInt(page as string) || 0,
    parseInt(pagination as string) || 25
  );
  
  res.status(httpStatus.OK).send(products);
}