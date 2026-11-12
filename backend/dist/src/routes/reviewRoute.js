"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewControllers_1 = require("../controllers/reviewControllers");
const verifyJWT_1 = require("../middleware/verifyJWT");
const router = (0, express_1.Router)();
router.get("/", reviewControllers_1.getAllReviews),
    router.post("/", reviewControllers_1.createReview);
router.delete("/:id", verifyJWT_1.verifyJWT, reviewControllers_1.deleteReview);
exports.default = router;
