import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";
import { User } from "./entities/user.entity";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @UseGuards(AccessTokenGuard)
  async me(
    @GetCurrentUserId() userId: string,
  ): Promise<Omit<User, "password">> {
    const user = await this.userService.findById(userId);
    const {
      password: _password,
      hashedRefreshToken: _hashedRefreshToken,
      ...result
    } = user;
    return result;
  }
}
