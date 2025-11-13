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
import { AccessTokenGuard } from "../../common/guards/access-token.guard";

@Controller("assistant")
@UseGuards(AccessTokenGuard)
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post("chat")
  async chat(@Body() createChatDto: CreateChatDto) {
    return this.assistantService.generateContent(createChatDto);
  }

  @Post("upload-file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // For now, just log the file and return a success message
    console.log("Received file:", file);
    return this.assistantService.processUploadedFile(file);
  }
}
