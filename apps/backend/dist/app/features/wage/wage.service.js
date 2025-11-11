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
exports.WageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const work_entry_entity_1 = require("./entities/work-entry.entity");
const user_service_1 = require("../user/user.service");
const job_service_1 = require("./job.service");
let WageService = class WageService {
    constructor(workEntryRepository, userService, jobService) {
        this.workEntryRepository = workEntryRepository;
        this.userService = userService;
        this.jobService = jobService;
    }
    async create(userId, createWorkEntryDto) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const job = await this.jobService.findOne(createWorkEntryDto.jobId, userId);
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        const startTime = new Date(createWorkEntryDto.startTime);
        const endTime = new Date(createWorkEntryDto.endTime);
        const workEntry = this.workEntryRepository.create({
            ...createWorkEntryDto,
            startTime,
            endTime,
            job,
            user,
            breakDuration: createWorkEntryDto.breakDuration || 0,
        });
        return this.workEntryRepository.save(workEntry);
    }
    async findAll(userId, options) {
        const where = { user: { id: userId } };
        if (options?.year && options?.month) {
            const startDate = new Date(options.year, options.month - 1, 1);
            const endDate = new Date(options.year, options.month, 0);
            where.startTime = (0, typeorm_2.Between)(startDate, endDate);
        }
        return this.workEntryRepository.find({ where, relations: ['job'] });
    }
    async findOne(id, userId) {
        const workEntry = await this.workEntryRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['job'],
        });
        if (!workEntry) {
            throw new common_1.NotFoundException('Work entry not found');
        }
        return workEntry;
    }
    async update(id, userId, updateWorkEntryDto) {
        const workEntry = await this.findOne(id, userId);
        const user = await this.userService.findById(userId);
        const updatedWorkEntry = { ...workEntry, ...updateWorkEntryDto };
        let job = workEntry.job;
        if (updateWorkEntryDto.jobId) {
            job = await this.jobService.findOne(updateWorkEntryDto.jobId, userId);
            if (!job) {
                throw new common_1.NotFoundException('Job not found');
            }
            updatedWorkEntry.job = job;
        }
        const startTime = new Date(updatedWorkEntry.startTime);
        const endTime = new Date(updatedWorkEntry.endTime);
        await this.workEntryRepository.update(id, { ...updatedWorkEntry, breakDuration: updateWorkEntryDto.breakDuration });
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const result = await this.workEntryRepository.delete({
            id,
            user: { id: userId },
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Work entry not found');
        }
    }
};
exports.WageService = WageService;
exports.WageService = WageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(work_entry_entity_1.WorkEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        job_service_1.JobService])
], WageService);
//# sourceMappingURL=wage.service.js.map