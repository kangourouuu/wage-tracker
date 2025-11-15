import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AssistantService } from "./assistant.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ConfirmImportDto } from "./dto/confirm-import.dto";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";

@Controller("assistant")
@UseGuards(AccessTokenGuard)
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post("chat")
  async chat(
    @Body() createChatDto: CreateChatDto,
    @GetCurrentUserId() userId: string,
  ) {
    const response = await this.assistantService.generateContent(
      createChatDto,
      userId,
    );
    return { message: response };
  }

  @Post("upload-file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
  ) {
    console.log("Received file:", file);
    return this.assistantService.processUploadedFile(file, userId);
  }

  @Post("confirm-import")
  async confirmImport(
    @Body() confirmImportDto: ConfirmImportDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.assistantService.confirmAndImportEntries(
      confirmImportDto,
      userId,
    );
  }
}
