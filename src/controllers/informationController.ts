import { Request, Response } from "express";
import httpStatus from "http-status";

export async function informationController(_req: Request, res: Response) {
  res.status(httpStatus.OK).send('In development');
}