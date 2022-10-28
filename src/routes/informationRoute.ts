import { informationController } from "@/controllers/informationController";
import { Router } from "express";

const informationRoute = Router();

informationRoute.get('/', informationController);

export { informationRoute };