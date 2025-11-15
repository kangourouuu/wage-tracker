import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";

@Controller("analytics")
@UseGuards(AccessTokenGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("earnings-trend")
  getEarningsTrend(
    @GetCurrentUserId() userId: string,
    @Query("period") period: string = "month",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.analyticsService.getEarningsTrend(
      userId,
      period,
      startDate,
      endDate,
    );
  }

  @Get("job-distribution")
  getJobDistribution(
    @GetCurrentUserId() userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.analyticsService.getJobDistribution(userId, startDate, endDate);
  }

  @Get("weekly-pattern")
  getWeeklyPattern(
    @GetCurrentUserId() userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.analyticsService.getWeeklyPattern(userId, startDate, endDate);
  }

  @Get("summary")
  getSummary(
    @GetCurrentUserId() userId: string,
    @Query("period") period: string = "week",
  ) {
    return this.analyticsService.getSummary(userId, period);
  }

  @Get("comparison")
  getComparison(
    @GetCurrentUserId() userId: string,
    @Query("currentStart") currentStart: string,
    @Query("currentEnd") currentEnd: string,
    @Query("previousStart") previousStart: string,
    @Query("previousEnd") previousEnd: string,
  ) {
    return this.analyticsService.getComparison(
      userId,
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
    );
  }
}
