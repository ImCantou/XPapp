"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginHandler_1 = require("../handler/loginHandler");
const router = (0, express_1.Router)();
router.post('/', loginHandler_1.loginHandler);
exports.default = router;
