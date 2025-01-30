import { Message, Role } from '@/utils/Interfaces';
import { googleKeyStorage, keyStorage } from '@/utils/Storage';
import { fetch } from 'expo/fetch';
import { useMMKVString } from 'react-native-mmkv';

type ApiHook = {
  sendMessage: (
    messages: Message[],
    selectedModel: string,
    onUpdate: (content: string, reasoningContent?: string) => void,
  ) => Promise<void>;
  deepseekKey?: string;
  googleKey?: string;
};

export const useApi = (): ApiHook => {
  const [deepseekKey] = useMMKVString('apikey', keyStorage);
  const [googleKey] = useMMKVString('apikey', googleKeyStorage);

  const sendMessage = async (
    messages: Message[],
    selectedModel: string,
    onUpdate: (content: string, reasoningContent?: string) => void,
  ) => {
    try {
      const messageHistory = messages.map((msg) => ({
        role: msg.role === Role.User ? 'user' : 'assistant',
        content: msg.content,
        prefix: msg.prefix,
      }));

      // The last message of deepseek-reasoner must be a user message, or an assistant message with prefix mode on
      messageHistory[messageHistory.length - 1].prefix = true;

      const response = await fetch('https://api.deepseek.com/beta/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: selectedModel === 'deepseek-reasoner' ? 'deepseek-reasoner' : 'deepseek-chat',
          messages: messageHistory,
          stream: true,
          stop: ['```'],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              const reasoningContent = parsed.choices[0]?.delta?.reasoning_content;

              if (content || reasoningContent) {
                onUpdate(content || '', reasoningContent);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  };

  return { sendMessage, deepseekKey, googleKey };
};
