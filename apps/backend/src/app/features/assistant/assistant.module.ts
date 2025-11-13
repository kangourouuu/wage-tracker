import { Module } from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { AssistantController } from "./assistant.controller";
import { ConfigModule } from "@nestjs/config";
import { WageModule } from "../wage/wage.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [ConfigModule, WageModule, UserModule],
  providers: [AssistantService],
  controllers: [AssistantController],
})
export class AssistantModule {}
