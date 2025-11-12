"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET || 'supersecret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecretrefresh',
    accessExp: process.env.JWT_ACCESS_EXP || '15m',
    refreshExp: process.env.JWT_REFRESH_EXP || '30d',
}));
//# sourceMappingURL=jwt.config.js.map