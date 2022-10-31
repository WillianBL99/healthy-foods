import { informationService } from "@/servers";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function informationController(_req: Request, res: Response) {
  const information = await informationService.getInformation();
  res.status(httpStatus.OK).send(information);
}