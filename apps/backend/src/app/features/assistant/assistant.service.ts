import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreateChatDto } from './dto/create-chat.dto';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AssistantService {
  private readonly geminiApiKey: string;
  private readonly geminiApiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.geminiApiKey = this.configService.get<string>('app.geminiApiKey');
    this.geminiApiUrl = this.configService.get<string>('app.geminiApiUrl');

    if (!this.geminiApiKey) {
      throw new InternalServerErrorException('Gemini API Key is not configured.');
    }
  }

  async generateContent(createChatDto: CreateChatDto): Promise<string> {
    const { message } = createChatDto;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(this.geminiApiUrl, requestBody, {
          params: {
            key: this.geminiApiKey,
          },
        }).pipe(
          catchError((error) => {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new InternalServerErrorException('Error communicating with Gemini API');
          }),
        ),
      );

      // Assuming the response structure has candidates[0].content.parts[0].text
      const geminiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!geminiResponse) {
        throw new InternalServerErrorException('Invalid response from Gemini API');
      }

      return geminiResponse;
    } catch (error) {
      throw error;
    }
  }

  async processUploadedFile(file: Express.Multer.File) {
    if (!file) {
      return { message: 'No file uploaded.' };
    }

    console.log(`Processing file: ${file.originalname}, type: ${file.mimetype}`);

    // Placeholder for file processing logic
    switch (file.mimetype) {
      case 'text/csv':
      case 'application/vnd.ms-excel': // .xls
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': // .xlsx
        // Implement CSV/Excel parsing logic here
        return { message: `Successfully received and will process spreadsheet file: ${file.originalname}` };
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        // Implement image processing (OCR) logic here
        return { message: `Successfully received image file: ${file.originalname}. OCR integration needed.` };
      default:
        return { message: `Unsupported file type: ${file.mimetype}` };
    }
  }
}
