// Example implementation for integrating Groq AI into the wage tracker
// This replaces Gemini with Groq Cloud API (free tier)

// 1. Install the package
// npm install groq-sdk

// 2. Update your .env file
// GROQ_API_KEY=your_groq_api_key_here

// 3. Backend Service Implementation
// apps/backend/src/features/assistant/assistant.service.ts

import Groq from "groq-sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AssistantService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>("GROQ_API_KEY"),
    });
  }

  /**
   * Chat with AI assistant
   */
  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      const completion = await this.groq.chat.completions.create({
        model: "llama3-70b-8192", // Fast and powerful
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: false,
      });

      return {
        response: completion.choices[0]?.message?.content || "No response",
        usage: completion.usage,
      };
    } catch (error) {
      console.error("Groq API Error:", error);
      throw new Error("Failed to get AI response");
    }
  }

  /**
   * Analyze work entries data
   */
  async analyzeWorkData(workEntries: any[], query: string): Promise<string> {
    // Convert work entries to readable format
    const dataText = this.formatWorkEntries(workEntries);

    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant analyzing work tracking data.
        Provide clear, concise, and actionable insights.
        Format your responses in a friendly, easy-to-read manner.`,
      },
      {
        role: "user",
        content: `Here is the work data:\n\n${dataText}\n\nQuestion: ${query}`,
      },
    ];

    const result = await this.chat(messages);
    return result.response;
  }

  /**
   * Get insights about work patterns
   */
  async getInsights(workEntries: any[]): Promise<string> {
    const dataText = this.formatWorkEntries(workEntries);

    const messages = [
      {
        role: "system",
        content: `You are a productivity analyst. Analyze work patterns and provide
        helpful insights about productivity, earnings, and work-life balance.`,
      },
      {
        role: "user",
        content: `Analyze this work data and provide 3-5 key insights:\n\n${dataText}`,
      },
    ];

    const result = await this.chat(messages);
    return result.response;
  }

  /**
   * Export work entries to CSV format
   */
  async exportToCSV(workEntries: any[]): Promise<string> {
    const headers = [
      "Date",
      "Job Name",
      "Start Time",
      "End Time",
      "Hours Worked",
      "Break (min)",
      "Wage/Hour",
      "Earnings",
    ];

    const rows = workEntries.map((entry) => {
      const start = new Date(entry.startTime);
      const end = new Date(entry.endTime);
      const durationMs = end.getTime() - start.getTime();
      const breakMs = entry.breakDuration * 60 * 1000;
      const hours = (durationMs - breakMs) / (1000 * 60 * 60);
      const earnings = hours * entry.job.wagePerHour;

      return [
        start.toLocaleDateString(),
        entry.job.name,
        start.toLocaleTimeString(),
        end.toLocaleTimeString(),
        hours.toFixed(2),
        entry.breakDuration,
        entry.job.wagePerHour,
        earnings.toFixed(2),
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    return csv;
  }

  /**
   * Format work entries for AI processing
   */
  private formatWorkEntries(workEntries: any[]): string {
    return workEntries
      .map((entry, index) => {
        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime);
        const durationMs = end.getTime() - start.getTime();
        const breakMs = entry.breakDuration * 60 * 1000;
        const hours = (durationMs - breakMs) / (1000 * 60 * 60);
        const earnings = hours * entry.job.wagePerHour;

        return `
Entry ${index + 1}:
- Date: ${start.toLocaleDateString()}
- Job: ${entry.job.name}
- Hours Worked: ${hours.toFixed(2)}
- Break Duration: ${entry.breakDuration} minutes
- Wage per Hour: ${entry.job.wagePerHour} VND
- Earnings: ${earnings.toFixed(2)} VND
        `.trim();
      })
      .join("\n\n");
  }

  /**
   * Suggest optimal work schedule
   */
  async suggestSchedule(
    workEntries: any[],
    targetHours: number,
    targetEarnings: number
  ): Promise<string> {
    const dataText = this.formatWorkEntries(workEntries);

    const messages = [
      {
        role: "system",
        content: `You are a work schedule optimizer. Help users plan their work
        schedule to achieve their goals while maintaining work-life balance.`,
      },
      {
        role: "user",
        content: `Based on this work history:\n\n${dataText}\n\n
        I want to work ${targetHours} hours and earn ${targetEarnings} VND.
        Please suggest an optimal work schedule.`,
      },
    ];

    const result = await this.chat(messages);
    return result.response;
  }
}

// 4. Controller Implementation
// apps/backend/src/features/assistant/assistant.controller.ts

import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { GetCurrentUserId } from "../../common/decorators/get-current-user-id.decorator";
import { WorkEntryService } from "../wage/work-entry.service";

@Controller("assistant")
@UseGuards(AccessTokenGuard)
export class AssistantController {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly workEntryService: WorkEntryService
  ) {}

  @Post("chat")
  async chat(
    @Body() body: { messages: Array<{ role: string; content: string }> }
  ) {
    return this.assistantService.chat(body.messages);
  }

  @Post("analyze")
  async analyze(
    @GetCurrentUserId() userId: string,
    @Body() body: { query: string }
  ) {
    const workEntries = await this.workEntryService.findAll(userId);
    const response = await this.assistantService.analyzeWorkData(
      workEntries,
      body.query
    );
    return { response };
  }

  @Get("insights")
  async getInsights(@GetCurrentUserId() userId: string) {
    const workEntries = await this.workEntryService.findAll(userId);
    const insights = await this.assistantService.getInsights(workEntries);
    return { insights };
  }

  @Get("export/csv")
  async exportCSV(@GetCurrentUserId() userId: string) {
    const workEntries = await this.workEntryService.findAll(userId);
    const csv = await this.assistantService.exportToCSV(workEntries);
    return { csv, filename: `work-entries-${Date.now()}.csv` };
  }

  @Post("schedule")
  async suggestSchedule(
    @GetCurrentUserId() userId: string,
    @Body() body: { targetHours: number; targetEarnings: number }
  ) {
    const workEntries = await this.workEntryService.findAll(userId);
    const schedule = await this.assistantService.suggestSchedule(
      workEntries,
      body.targetHours,
      body.targetEarnings
    );
    return { schedule };
  }
}

// 5. Frontend Integration
// frontend/src/features/ai-assistant/store/aiAssistantStore.ts

import { create } from "zustand";
import api from "../../../services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiAssistantStore {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  toggle: () => void;
  sendMessage: (content: string) => Promise<void>;
  getInsights: () => Promise<void>;
  exportCSV: () => Promise<void>;
  clearMessages: () => void;
}

export const useAiAssistantStore = create<AiAssistantStore>((set, get) => ({
  isOpen: false,
  messages: [],
  isLoading: false,

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  sendMessage: async (content: string) => {
    const { messages } = get();
    const newMessages = [...messages, { role: "user" as const, content }];

    set({ messages: newMessages, isLoading: true });

    try {
      const response = await api.post("/assistant/chat", {
        messages: newMessages,
      });

      set({
        messages: [
          ...newMessages,
          { role: "assistant" as const, content: response.data.response },
        ],
        isLoading: false,
      });
    } catch (error) {
      console.error("AI Chat Error:", error);
      set({
        messages: [
          ...newMessages,
          {
            role: "assistant" as const,
            content: "Sorry, I encountered an error. Please try again.",
          },
        ],
        isLoading: false,
      });
    }
  },

  getInsights: async () => {
    set({ isLoading: true });

    try {
      const response = await api.get("/assistant/insights");
      const { messages } = get();

      set({
        messages: [
          ...messages,
          {
            role: "assistant" as const,
            content: response.data.insights,
          },
        ],
        isLoading: false,
      });
    } catch (error) {
      console.error("Insights Error:", error);
      set({ isLoading: false });
    }
  },

  exportCSV: async () => {
    try {
      const response = await api.get("/assistant/export/csv");
      const { csv, filename } = response.data;

      // Create download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export Error:", error);
    }
  },

  clearMessages: () => set({ messages: [] }),
}));

// 6. Example Usage in Component
// frontend/src/components/AssistantPanel.tsx

import React, { useState } from "react";
import { useAiAssistantStore } from "../features/ai-assistant/store/aiAssistantStore";
import styles from "./AssistantPanel.module.css";

export const AssistantPanel: React.FC = () => {
  const { messages, isLoading, sendMessage, getInsights, exportCSV } =
    useAiAssistantStore();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>🤖 AI Assistant (Groq)</h3>
        <div className={styles.actions}>
          <button onClick={getInsights} disabled={isLoading}>
            💡 Get Insights
          </button>
          <button onClick={exportCSV}>📊 Export CSV</button>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={styles[msg.role]}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className={styles.loading}>Thinking...</div>}
      </div>

      <div className={styles.input}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about your work data..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

// 7. Environment Configuration
// Add to .env file:
/*
GROQ_API_KEY=gsk_your_api_key_here
*/

// 8. Module Registration
// apps/backend/src/features/assistant/assistant.module.ts
/*
import { Module } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { WageModule } from '../wage/wage.module';

@Module({
  imports: [WageModule],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
*/

// Benefits of Groq over Gemini:
// 1. ⚡ 10x faster inference
// 2. 💰 More generous free tier (14,400 requests/day)
// 3. 🚀 Simple API
// 4. 🔥 Excellent model quality (Llama 3 70B)
// 5. 💳 No credit card required for free tier
