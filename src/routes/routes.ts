import { controller } from "#controllers/wrapperController.js";
import { Router } from "express";

export const router = Router();

router.get("/test", controller);
