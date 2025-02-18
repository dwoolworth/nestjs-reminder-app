import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('AI_AGENT_KEY'),
      baseURL: this.configService.get<string>('AI_AGENT_ENDPOINT') + '/api/v1/',
    });
  }

  async getChatCompletion(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'n/a',
        messages: [{ role: 'user', content: message }],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error calling AI service:', error);
      throw new Error('Failed to get chat completion');
    }
  }
}
