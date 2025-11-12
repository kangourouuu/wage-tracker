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
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./entities/job.entity");
const user_service_1 = require("../user/user.service");
let JobService = class JobService {
    constructor(jobRepository, userService) {
        this.jobRepository = jobRepository;
        this.userService = userService;
    }
    async create(userId, createJobDto) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const job = this.jobRepository.create({ ...createJobDto, user });
        return this.jobRepository.save(job);
    }
    async findAll(userId) {
        return this.jobRepository.find({ where: { user: { id: userId } } });
    }
    async findOne(id, userId) {
        const job = await this.jobRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        return job;
    }
    async update(id, userId, updateJobDto) {
        const job = await this.findOne(id, userId);
        Object.assign(job, updateJobDto);
        return this.jobRepository.save(job);
    }
    async remove(id, userId) {
        const result = await this.jobRepository.delete({
            id,
            user: { id: userId },
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Job not found');
        }
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], JobService);
//# sourceMappingURL=job.service.js.map