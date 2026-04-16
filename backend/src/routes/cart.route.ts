import express from "express";
import { get, add, update, remove } from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, get);
router.post("/", verifyToken, add);
router.put("/", verifyToken, update);
router.delete("/:cartItemId", verifyToken, remove);

export default router;
