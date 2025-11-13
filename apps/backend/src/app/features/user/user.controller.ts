import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";
import { User } from "./entities/user.entity";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { UserDto } from "./dto/user.dto";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get("me")
  @UseGuards(AccessTokenGuard)
  async me(@GetCurrentUserId() userId: string): Promise<UserDto> {
    const user = await this.userService.findById(userId);
    return this.mapper.map(user, User, UserDto);
  }
}
