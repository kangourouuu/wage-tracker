import { Controller, Post, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('chat')
  async chat(@Body() createChatDto: CreateChatDto) {
    return this.assistantService.generateContent(createChatDto);
  }
}
