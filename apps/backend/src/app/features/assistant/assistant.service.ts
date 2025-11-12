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

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreateChatDto } from './dto/create-chat.dto';
import { catchError, firstValueFrom } from 'rxjs';
import * as csv from 'csv-parser'; // Import csv-parser
import * as xlsx from 'xlsx'; // Import xlsx
import { Readable } from 'stream'; // Import Readable stream

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

    let extractedData: any[] = [];
    let responseMessage: string = '';

    try {
      switch (file.mimetype) {
        case 'text/csv':
          extractedData = await this.parseCsv(file.buffer);
          responseMessage = `Successfully processed CSV file: ${file.originalname}. Extracted ${extractedData.length} rows.`;
          break;
        case 'application/vnd.ms-excel': // .xls
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': // .xlsx
          extractedData = this.parseExcel(file.buffer);
          responseMessage = `Successfully processed Excel file: ${file.originalname}. Extracted ${extractedData.length} rows.`;
          break;
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
          responseMessage = `Successfully received image file: ${file.originalname}. OCR integration needed for content extraction.`;
          break;
        default:
          responseMessage = `Unsupported file type: ${file.mimetype}`;
          break;
      }

      // Here you would typically process extractedData further, e.g.,
      // send it to the AI for analysis or save to database.
      console.log('Extracted Data:', extractedData);
      return { message: responseMessage, data: extractedData };

    } catch (error) {
      console.error('Error processing uploaded file:', error);
      throw new InternalServerErrorException(`Failed to process file: ${file.originalname}`);
    }
  }

  private async parseCsv(buffer: Buffer): Promise<any[]> {
    const results: any[] = [];
    const stream = Readable.from(buffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private parseExcel(buffer: Buffer): any[] {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet);
    return json;
  }
}

