import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateChatDto } from "./dto/create-chat.dto";
import Groq from "groq-sdk";
import * as csv from "csv-parser"; // Import csv-parser
import * as xlsx from "xlsx"; // Import xlsx
import { Readable } from "stream"; // Import Readable stream
import { WageService } from "../wage/wage.service";
import { JobService } from "../wage/job.service";

@Injectable()
export class AssistantService {
  private readonly groqClient: Groq | null;
  private readonly groqModel: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly wageService: WageService,
    private readonly jobService: JobService,
  ) {
    const groqApiKey = this.configService.get<string>("app.groqApiKey");
    this.groqModel = this.configService.get<string>("app.groqModel");

    console.log("🔧 Assistant Service Initialization:");
    console.log(
      "  - GROQ_API_KEY present:",
      groqApiKey ? "Yes (length: " + groqApiKey.length + ")" : "No",
    );
    console.log("  - GROQ_MODEL:", this.groqModel);

    if (!groqApiKey) {
      console.warn(
        "⚠️ Groq API Key is not configured. AI assistant features will be disabled.",
      );
      console.warn(
        "Please set GROQ_API_KEY environment variable to enable AI features.",
      );
      this.groqClient = null;
    } else {
      this.groqClient = new Groq({
        apiKey: groqApiKey,
      });
      console.log("✅ Groq API Key is configured - AI Assistant is ready");
    }
  }

  async generateContent(createChatDto: CreateChatDto): Promise<string> {
    const { message } = createChatDto;

    // Check if API key is configured
    if (!this.groqClient) {
      console.error("❌ GROQ_API_KEY is not set in environment variables");
      throw new InternalServerErrorException(
        "AI Assistant is not configured. Please contact the administrator to set up the GROQ_API_KEY.",
      );
    }

    console.log("🔑 Using Groq model:", this.groqModel);

    try {
      const chatCompletion = await this.groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: this.groqModel,
        temperature: 0.7,
        max_tokens: 4096,
      });

      console.log("✅ Received response from Groq API");

      const groqResponse = chatCompletion.choices?.[0]?.message?.content;

      if (!groqResponse) {
        console.error("❌ Invalid response structure from Groq API");
        throw new InternalServerErrorException(
          "Invalid response from Groq API",
        );
      }

      return groqResponse;
    } catch (error) {
      // Handle Groq-specific errors
      console.error("❌ Groq API Error Details:");
      console.error("Error:", error.message);

      if (error.status === 400) {
        throw new InternalServerErrorException(
          "Invalid request to Groq AI. Please check the API configuration.",
        );
      } else if (error.status === 401) {
        throw new InternalServerErrorException(
          "Groq API Key is invalid or lacks permissions. Please check your API key.",
        );
      } else if (error.status === 429) {
        throw new InternalServerErrorException(
          "Groq API rate limit exceeded. Please try again later.",
        );
      }

      throw new InternalServerErrorException(
        "Error communicating with Groq AI. Please try again later.",
      );
    }
  }

  async processUploadedFile(file: Express.Multer.File, userId: string) {
    if (!file) {
      return { message: "No file uploaded." };
    }

    console.log(
      `Processing file: ${file.originalname}, type: ${file.mimetype}`,
    );

    let extractedData: any[] = [];
    const responseMessage: string = "";

    try {
      // Step 1: Extract data from file
      switch (file.mimetype) {
        case "text/csv":
          extractedData = await this.parseCsv(file.buffer);
          break;
        case "application/vnd.ms-excel": // .xls
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": // .xlsx
          extractedData = this.parseExcel(file.buffer);
          break;
        case "image/jpeg":
        case "image/png":
        case "image/gif":
          return {
            message: `Image file received: ${file.originalname}. OCR for image processing is not yet implemented. Please use CSV or Excel files.`,
            data: [],
          };
        default:
          return {
            message: `Unsupported file type: ${file.mimetype}. Please upload CSV or Excel files.`,
            data: [],
          };
      }

      if (extractedData.length === 0) {
        return {
          message: "No data found in the file.",
          data: [],
        };
      }

      // Step 2: Get user's jobs
      const userJobs = await this.jobService.findAll(userId);

      if (userJobs.length === 0) {
        return {
          message:
            "Please create at least one job before importing work entries.",
          data: extractedData,
        };
      }

      // Step 3: Use AI to analyze and structure the data
      const aiAnalysis = await this.analyzeWorkDataWithAI(
        extractedData,
        userJobs,
      );

      if (!aiAnalysis.workEntries || aiAnalysis.workEntries.length === 0) {
        return {
          message: `Analyzed ${extractedData.length} rows, but couldn't identify valid work entries. ${aiAnalysis.message || "Please ensure your file has columns for date, start time, end time, and job/shift name."}`,
          data: extractedData,
        };
      }

      // Step 4: Return analysis for user confirmation
      return {
        message: `Found ${aiAnalysis.workEntries.length} work entries in ${file.originalname}. Please review and confirm to import.`,
        needsConfirmation: true,
        data: {
          workEntries: aiAnalysis.workEntries,
          jobs: userJobs,
          aiMessage: aiAnalysis.message,
        },
      };
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      throw new InternalServerErrorException(
        `Failed to process file: ${error.message}`,
      );
    }
  }

  async confirmAndImportEntries(confirmImportDto: any, userId: string) {
    const createdEntries = [];
    const errors = [];

    for (const entry of confirmImportDto.workEntries) {
      try {
        const workEntry = await this.wageService.create(userId, {
          startTime: entry.startTime,
          endTime: entry.endTime,
          jobId: entry.jobId,
          breakDuration: entry.breakDuration || 0,
        });
        createdEntries.push(workEntry);
      } catch (error) {
        errors.push(
          `Failed to create entry for ${entry.startTime}: ${error.message}`,
        );
      }
    }

    let responseMessage = `Successfully imported ${createdEntries.length} work entries.`;

    if (errors.length > 0) {
      responseMessage += ` ${errors.length} entries failed: ${errors.slice(0, 3).join(", ")}${errors.length > 3 ? "..." : ""}`;
    }

    return {
      message: responseMessage,
      data: {
        created: createdEntries.length,
        failed: errors.length,
        entries: createdEntries,
        errors: errors,
      },
    };
  }

  private async analyzeWorkDataWithAI(
    data: any[],
    userJobs: any[],
  ): Promise<any> {
    // Prepare the prompt for AI analysis
    const jobsList = userJobs
      .map((j) => `- ${j.name} (ID: ${j.id}, Rate: $${j.wagePerHour}/hour)`)
      .join("\n");

    const prompt = `You are analyzing work schedule data to extract work entries.

User's available jobs:
${jobsList}

Raw data from file (${data.length} rows):
${JSON.stringify(data.slice(0, 20), null, 2)}${data.length > 20 ? "\n... (and more rows)" : ""}

Instructions:
1. Identify columns that represent: date, start time, end time, job/shift name, break duration
2. Match job names from the data to the user's available jobs (be flexible with naming variations)
3. Calculate work hours from start/end times
4. Format each work entry as:
   {
     "startTime": "ISO 8601 datetime string",
     "endTime": "ISO 8601 datetime string",
     "jobId": "matching job ID from user's jobs",
     "breakDuration": number (in minutes, default 0)
   }

Return ONLY a valid JSON object in this exact format:
{
  "workEntries": [...array of work entry objects...],
  "message": "brief explanation of what was found"
}

If you cannot identify work data, return:
{
  "workEntries": [],
  "message": "explanation of what's missing or unclear"
}`;

    try {
      const aiResponse = await this.generateContent({ message: prompt });

      // Extract JSON from AI response (it might include markdown code blocks)
      let jsonStr = aiResponse.trim();

      // Remove markdown code blocks if present
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }

      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (error) {
      console.error("AI analysis error:", error);
      return {
        workEntries: [],
        message:
          "Failed to analyze the data structure. Please ensure your file has clear columns for date, time, and job information.",
      };
    }
  }

  private async parseCsv(buffer: Buffer): Promise<any[]> {
    const results: any[] = [];
    const stream = Readable.from(buffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          resolve(results);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  private parseExcel(buffer: Buffer): any[] {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet);
    return json;
  }
}
