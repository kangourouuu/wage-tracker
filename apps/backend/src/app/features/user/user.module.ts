import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserProfile } from "./user.profile";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserProfile],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
