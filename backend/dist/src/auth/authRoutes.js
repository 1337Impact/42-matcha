"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authControllers_1 = require("./authControllers");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", authControllers_1.login);
exports.default = router;
