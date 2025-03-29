import { ipcMain, webContents, BrowserWindow } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import * as neo4jService from './neo4jService';

const providerViewMap = new Map();

function registerProviderView(providerId, webContentsId) {
  providerViewMap.set(providerId, webContentsId);
}

function getWebContentsForProvider(providerId) {
  const webContentsId = providerViewMap.get(providerId);
  return webContents.fromId(webContentsId);
}

const providerIdToClassNameMap = {
  'noi:chatgpt': 'OpenAIAsk',
  'noi:claude': 'ClaudeAsk',
  'noi:gemini': 'GeminiAsk',
  'noi:deepseek': 'DeepSeekAsk',
  'noi:githubcopilot': 'GitHubCopilotAsk',
  'noi:sora': 'SoraAsk',
  'noi:poe': 'PoeAsk',
  'noi:perplexity': 'PerplexityAsk',
  'noi:copilot': 'CopilotAsk',
  'noi:huggingchat': 'HuggingChatAsk',
  'noi:qwen': 'QwenAsk',
  'noi:notebooklm': 'NotebooklmAsk'
};

function getProviderDisplayNameFromId(providerId) {
  return providerIdToClassNameMap[providerId] || 'Unknown Provider';
}

ipcMain.on('reroute-ai-output', async (event, { sourceMessageId, textContent, targetProviderId }) => {
  try {
    const newMessageId = uuidv4();
    const newMessage = {
      messageId: newMessageId,
      role: 'routed_input',
      providerId: targetProviderId,
      content: textContent,
      timestamp: Date.now(),
      conversationId: uuidv4()
    };

    await neo4jService.recordBranchedMessage(sourceMessageId, newMessage);

    const targetWebContents = getWebContentsForProvider(targetProviderId);
    const targetProviderClassName = getProviderDisplayNameFromId(targetProviderId);

    if (targetWebContents) {
      const script = `window.NoiAskGlobal.rerouteInput('${targetProviderClassName}', '${textContent}')`;
      await targetWebContents.executeJavaScript(script);
      event.sender.send('reroute-status', { success: true, newMessageId });
    } else {
      event.sender.send('reroute-status', { success: false, error: 'Target webContents not found' });
    }
  } catch (error) {
    console.error('Error in reroute-ai-output handler:', error);
    event.sender.send('reroute-status', { success: false, error: error.message });
  }
});

ipcMain.on('reroute-status', (event, { success, newMessageId, error }) => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    mainWindow.webContents.send('reroute-status', { success, newMessageId, error });
  }
});
