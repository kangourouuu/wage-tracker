import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { WageService } from "./wage.service";
import { CreateWorkEntryDto } from "./dto/create-work-entry.dto";
import { UpdateWorkEntryDto } from "./dto/update-work-entry.dto";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";

@Controller("work-entries")
@UseGuards(AccessTokenGuard)
export class WageController {
  constructor(private readonly wageService: WageService) {}

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createWorkEntryDto: CreateWorkEntryDto,
  ) {
    return this.wageService.create(userId, createWorkEntryDto);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.wageService.findAll(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.wageService.findOne(id, userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateWorkEntryDto: UpdateWorkEntryDto,
  ) {
    return this.wageService.update(id, userId, updateWorkEntryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.wageService.remove(id, userId);
  }

  @Post("clock-in")
  clockIn(
    @GetCurrentUserId() userId: string,
    @Body() body: { jobId: string; startTime: string },
  ) {
    return this.wageService.clockIn(userId, body.jobId, body.startTime);
  }

  @Post(":id/clock-out")
  clockOut(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() body: { endTime: string; breakDuration: number },
  ) {
    return this.wageService.clockOut(
      id,
      userId,
      body.endTime,
      body.breakDuration,
    );
  }

  @Get("ongoing/current")
  getOngoingEntry(@GetCurrentUserId() userId: string) {
    return this.wageService.getOngoingEntry(userId);
  }
}
