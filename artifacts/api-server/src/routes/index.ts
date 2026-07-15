import { Router, type IRouter } from "express";
import healthRouter from "./health";
import trendingRouter from "./trending";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trendingRouter);

export default router;
