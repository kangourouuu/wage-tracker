"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const work_entry_entity_1 = require("./entities/work-entry.entity");
const job_entity_1 = require("./entities/job.entity");
const wage_service_1 = require("./wage.service");
const wage_controller_1 = require("./wage.controller");
const job_service_1 = require("./job.service");
const job_controller_1 = require("./job.controller");
const user_module_1 = require("../user/user.module");
let WageModule = class WageModule {
};
exports.WageModule = WageModule;
exports.WageModule = WageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([work_entry_entity_1.WorkEntry, job_entity_1.Job]), user_module_1.UserModule],
        providers: [wage_service_1.WageService, job_service_1.JobService],
        controllers: [wage_controller_1.WageController, job_controller_1.JobController],
        exports: [wage_service_1.WageService, job_service_1.JobService],
    })
], WageModule);
//# sourceMappingURL=wage.module.js.map