"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const access_token_guard_1 = require("../../common/guards/access-token.guard");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
const user_entity_1 = require("./entities/user.entity");
const nestjs_1 = require("@automapper/nestjs");
const user_dto_1 = require("./dto/user.dto");
let UserController = class UserController {
    constructor(userService, mapper) {
        this.userService = userService;
        this.mapper = mapper;
    }
    async me(userId) {
        const user = await this.userService.findById(userId);
        return this.mapper.map(user, user_entity_1.User, user_dto_1.UserDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    __param(1, (0, nestjs_1.InjectMapper)()),
    __metadata("design:paramtypes", [user_service_1.UserService, Object])
], UserController);
//# sourceMappingURL=user.controller.js.map