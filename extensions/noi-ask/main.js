/**
 * NoiAsk: Batch send messages to AI Chat.
 *
 * This file is a modified version of the GodMode.
 * ref: https://github.com/smol-ai/GodMode/tree/main/src/providers
 */

class NoiAsk {
  static sync(message) {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      const nativeTextareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeTextareaSetter.call(inputElement, message);
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      });
      inputElement.dispatchEvent(inputEvent);
    }
  }

  static autoFocus() {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      inputElement.focus();
    }
  }

  static simulateUserInput(element, text) {
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    });
    element.focus();
    element.value = text;
    element.dispatchEvent(inputEvent);
  }

  static autoClick(btn) {
    btn.focus();
    btn.disabled = false;
    btn.click();
  }
}

class OpenAIAsk extends NoiAsk {
  static name = 'ChatGPT';
  static url = 'https://chatgpt.com';

  static sync(message) {
    const inputElement = document.querySelector('form #prompt-textarea');
    if (inputElement) {
      inputElement.focus();
      inputElement.innerHTML = ''; // Clear existing content
      const lines = message.split('\n');
      lines.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line; // Use textContent to prevent HTML injection
        inputElement.appendChild(p);
      });
    }
  }

  static submit() {
    const forms = document.querySelectorAll('main form');
    const form = forms[forms.length - 1];
    const buttons = form.querySelectorAll('button');
    const btn = buttons[buttons.length - 1];
    if (btn) this.autoClick(btn);
  }
}

class ClaudeAsk extends NoiAsk {
  static name = 'Claude';
  static url = 'https://claude.ai';

  static sync(message) {
    const inputElement = document.querySelector('div.ProseMirror');
    if (inputElement) {
      inputElement.focus();
      inputElement.innerHTML = '';
      document.execCommand('insertText', false, message);
    }
  }

  static autoFocus() {
    this.sync('');
  }

  static submit() {
    // subsequent screens use this
    let btn = document.querySelector('button[aria-label*="Send Message"]');
    if (!btn) { // new chats use this
      btn = document.querySelector('button:has(div svg)');
    }
    if (!btn) { // last ditch attempt
      btn = document.querySelector('button:has(svg)');
    }
    if (btn) this.autoClick(btn);
  }
}

class GeminiAsk extends NoiAsk {
  static name = 'Gemini';
  static url = 'https://gemini.google.com';

  static sync(message) {
    const inputElement = document.querySelector('.ql-editor.textarea');
    if (inputElement) {
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.value = message;
      inputElement.dispatchEvent(inputEvent);
      // bard is weird
      inputElement.querySelector('p').textContent = message;
    }
  }

  static autoFocus() {
    const inputElement = document.querySelector('.ql-editor.textarea');
    if (inputElement) {
      inputElement.focus();
    }
  }

  static submit() {
    const btn = document.querySelector('button[aria-label*="Send message"]') || document.querySelector('button.send-button');
    if (btn) {
      btn.setAttribute('aria-disabled', 'false'); // doesn't work alone
      btn.focus();
      btn.click();
    }
  }
}

class HuggingChatAsk extends NoiAsk {
  static name = 'HuggingChat';
  static url = 'https://huggingface.co/chat';

  static sync(message) {
    var inputElement = document.querySelector('textarea[placeholder*="Ask anything"]');
    if (inputElement) {
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.value = message;
      inputElement.dispatchEvent(inputEvent);
    }
  }

  static autoFocus() {
    var inputElement = document.querySelector('textarea[placeholder*="Ask anything"]');
    if (inputElement) {
      inputElement.focus();
    }
  }

  static submit() {
    var btn = document.querySelector('form.relative > div > button[type="submit"]');
    if (btn) this.autoClick(btn);
  }
}


class SoraAsk extends NoiAsk {
  static name = 'Sora';
  static url = 'https://sora.com';

  static submit() {
    const buttons = document.querySelectorAll('button[data-disabled]');
    const lastButton = buttons[buttons.length - 1];
    if (lastButton) this.autoClick(lastButton);
  }
}

class PoeAsk extends NoiAsk {
  static name = 'Poe';
  static url = 'https://poe.com';

  static submit() {
    const btn = document.querySelector('button[data-button-send]');
    if (btn) this.autoClick(btn);
  }
}

class PerplexityAsk extends NoiAsk {
  static name = 'Perplexity';
  static url = 'https://www.perplexity.ai';

  static submit() {
    const btns = Array.from(document.querySelectorAll('button.bg-super'));
    if (btns[0]) {
      const btnsWithSvgPath = btns.filter(button => button.querySelector('svg path'));
      const btn = btnsWithSvgPath[btnsWithSvgPath.length - 1];
      btn.click();
    }
  }
}

class CopilotAsk extends NoiAsk {
  static name = 'Copilot';
  static url = 'https://copilot.microsoft.com';

  static sync(message) {
    const inputElement = document.querySelector('#userInput');
    if (inputElement) {
      const nativeTextareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeTextareaSetter.call(inputElement, message);
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      });
      inputElement.dispatchEvent(inputEvent);
    }
    // if (inputElement) {
    //   this.simulateUserInput(inputElement, message);
    // }
  }

  static submit() {
    const btn = document.querySelector('button[aria-label="Submit message"]');
    if (btn) this.autoClick(btn);
  }
}

class GitHubCopilotAsk extends NoiAsk {
  static name = 'GitHub';
  static url = 'https://github.com/copilot';

  static sync(message) {
    const inputElement = document.querySelector('form #copilot-chat-textarea');
    if (inputElement) {
      inputElement.focus();
      document.execCommand('undo');
      document.execCommand('insertText', false, message);
    }
  }

  static submit() {
    const btns = document.querySelectorAll('form button');
    const btn = btns[btns.length - 1];
    if (btn) this.autoClick(btn);
  }
}

class NotebooklmAsk extends NoiAsk {
  static name = 'NotebookLM';
  static url = 'https://notebooklm.google.com';

  static submit() {
    const btn = document.querySelector('form button[type="submit"]');
    if (btn) btn.click();
  }
}

class DeepSeekAsk extends NoiAsk {
  static name = 'DeepSeek'; // DeepSeek
  static url = 'https://chat.deepseek.com';

  static submit() {
    const btn = document.querySelector('div[role="button"][aria-disabled]');
    if (btn) btn.click();
  }
}

// Define the globally accessible function window.NoiAskGlobal.rerouteInput
window.NoiAskGlobal = {
  rerouteInput(targetProviderClassName, textContent) {
    const providerClass = window.NoiAsk[targetProviderClassName];
    if (providerClass) {
      providerClass.sync(textContent);
      providerClass.submit();
    } else {
      console.error(`Provider class ${targetProviderClassName} not found`);
    }
  }
};

// TODO: Improve the sync method to handle more complex input scenarios
// The purpose of this TODO is to enhance the sync method to handle more complex input scenarios, such as multiline messages or messages with special formatting.
// TODO: Enhance the submit method to support additional AI chat platforms
// The purpose of this TODO is to improve the submit method to support a wider range of AI chat platforms, ensuring compatibility with various services.
// TODO: Add more AI chat platforms
// The purpose of this TODO is to expand the list of supported AI chat platforms, providing users with more options for interacting with different AI services.
// TODO: Refactor existing AI chat classes to improve code readability and maintainability
// The purpose of this TODO is to refactor the existing AI chat classes to enhance code readability and maintainability, making it easier to manage and extend the codebase.

window.NoiAsk = {
  OpenAIAsk,
  ClaudeAsk,
  GeminiAsk,
  CopilotAsk,
  HuggingChatAsk,
  PerplexityAsk,
  NotebooklmAsk,
  GitHubCopilotAsk,
  PoeAsk,
  SoraAsk,
  DeepSeekAsk,
};
