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
exports.WageController = void 0;
const common_1 = require("@nestjs/common");
const wage_service_1 = require("./wage.service");
const create_work_entry_dto_1 = require("./dto/create-work-entry.dto");
const update_work_entry_dto_1 = require("./dto/update-work-entry.dto");
const access_token_guard_1 = require("../../common/guards/access-token.guard");
const get_current_user_id_decorator_1 = require("../../common/decorators/get-current-user-id.decorator");
let WageController = class WageController {
    constructor(wageService) {
        this.wageService = wageService;
    }
    create(userId, createWorkEntryDto) {
        return this.wageService.create(userId, createWorkEntryDto);
    }
    findAll(userId) {
        return this.wageService.findAll(userId);
    }
    findOne(id, userId) {
        return this.wageService.findOne(id, userId);
    }
    update(id, userId, updateWorkEntryDto) {
        return this.wageService.update(id, userId, updateWorkEntryDto);
    }
    remove(id, userId) {
        return this.wageService.remove(id, userId);
    }
};
exports.WageController = WageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_work_entry_dto_1.CreateWorkEntryDto]),
    __metadata("design:returntype", void 0)
], WageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_work_entry_dto_1.UpdateWorkEntryDto]),
    __metadata("design:returntype", void 0)
], WageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WageController.prototype, "remove", null);
exports.WageController = WageController = __decorate([
    (0, common_1.Controller)('work-entries'),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    __metadata("design:paramtypes", [wage_service_1.WageService])
], WageController);
//# sourceMappingURL=wage.controller.js.map