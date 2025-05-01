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

class GrokAsk extends NoiAsk {
  static name = 'Grok';
  static url = 'https://grok.com';

  static submit() {
    const btn = document.querySelector('button[type="submit"]');
    if (btn) btn.click();
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
    let btn = document.querySelector('button[aria-label*="send message" i]');
    if (!btn) {
      const btns = document.querySelectorAll('fieldset button:has(svg)');
      btn = btns[btns.length - 1];
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

class PiAsk extends NoiAsk {
  static name = 'Pi';
  static url = 'https://pi.ai/talk';

  static submit() {
    const inputElement = document.querySelector('textarea[placeholder="Talk with Pi"]');
    if (inputElement) {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        view: window,
        bubbles: true
      });
      inputElement.dispatchEvent(event);
    }
  }
}

class CozeAsk extends NoiAsk {
  static name = 'Coze';
  static url = 'https://www.coze.com/home';

  static submit() {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      const nextElement = inputElement.nextElementSibling;
      if (nextElement) {
        const btn = nextElement.querySelector('button');
        if (btn) btn.click();
      }
    }
  }
}

class YouAsk extends NoiAsk {
  static name = 'YOU';
  static url = 'https://you.com';

  static submit() {
    const btn = document.querySelector('button[data-eventactionname="click_send"]');
    if (btn) btn.click();
  }
}


class GroqAsk extends NoiAsk {
  static name = 'Groq';
  static url = 'https://chat.groq.com';

  static submit() {
    const btn = document.querySelector('form button[type="submit"]');
    if (btn) btn.click();
  }
}

class LeChatMistralAsk extends NoiAsk {
  static name = 'LeChatMistral';
  static url = 'https://chat.mistral.ai/chat';

  static submit() {
    const btn = document.querySelector('button[aria-label="Send question"]');
    if (btn) btn.click();
  }
}

class SunoAsk extends NoiAsk {
  static name = 'Suno AI';
  static url = 'https://suno.com';

  static submit() {
    const btn = Array.from(document.querySelectorAll('button')).find(i => i.innerText.includes('Create'));
    if (btn) btn.click();
  }
}

class CozeCNAsk extends NoiAsk {
  static name = 'Coze';
  static url = 'https://www.coze.cn/home';

  static submit() {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      const nextElement = inputElement.nextElementSibling;
      if (nextElement) {
        const btn = nextElement.querySelector('button');
        if (btn) btn.click();
      }
    }
  }
}

class ChatGLMAsk extends NoiAsk {
  static name = 'ChatGLM'; // 智谱清言
  static url = 'https://chatglm.cn';

  static submit() {
    const btn = document.querySelector('#search-input-box .enter img');
    if (btn) btn.click();
  }
}

class DoubaoAsk extends NoiAsk {
  static name = 'Doubao'; // 豆包
  static url = 'https://www.doubao.com';

  static submit() {
    const btn = document.querySelector('#flow-end-msg-send');
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

class TongyiAsk extends NoiAsk {
  static name = 'QianWen'; // 通义千问
  static url = 'https://tongyi.aliyun.com/qianwen';

  static submit() {
    const btn = document.querySelector('div[class*=operateBtn]');
    if (btn) btn.click();
  }
}

class QwenAsk extends NoiAsk {
  static name = 'Qwen'; // 千问
  static url = 'https://chat.qwen.ai';

  static submit() {
    const btn = document.querySelector('button#send-message-button');
    if (btn) btn.click();
  }
}

class JimengAsk extends NoiAsk {
  static name = 'Jimeng'; // 即梦
  static url = 'https://jimeng.jianying.com';

  static sync(message) {
    // image generation
    const inputElement = document.querySelector('#prompt-text-editor');
    if (inputElement) {
      inputElement.focus();
      inputElement.innerHTML = '';

      const span = document.createElement('span');
      span.textContent = message;
      inputElement.appendChild(span);

      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      });
      inputElement.dispatchEvent(inputEvent);
    }
  }

  static submit() {
    const btn = document.querySelector('[class*="generateButton"]');
    if (btn) this.autoClick(btn);
  }
}

class MetasoAsk extends NoiAsk {
  static name = 'Metaso'; // 秘塔
  static url = 'https://metaso.cn';

  static submit() {
    const btn = document.querySelector('button.send-arrow-button');
    if (btn) btn.click();
  }
}

class YuanbaoAsk extends NoiAsk {
  static name = 'YuanBao'; // 腾讯元宝
  static url = 'https://yuanbao.tencent.com/chat';

  static sync(message) {
    const inputElement = document.querySelector('[contenteditable=true]');
    if (inputElement) {
      inputElement.focus();
      inputElement.innerHTML = message;
    }
  }

  static submit() {
    const btn = document.querySelector('.icon-send');
    if (btn) btn.click();
  }
}

window.NoiAsk = {
  OpenAIAsk,
  ClaudeAsk,
  GeminiAsk,
  GrokAsk,
  CopilotAsk,
  HuggingChatAsk,
  PerplexityAsk,
  NotebooklmAsk,
  GitHubCopilotAsk,
  LeChatMistralAsk,
  PiAsk,
  GroqAsk,
  PoeAsk,
  SoraAsk,
  SunoAsk,
  CozeAsk,
  YouAsk,
  CozeCNAsk,
  DoubaoAsk,
  ChatGLMAsk,
  TongyiAsk,
  QwenAsk,
  JimengAsk,
  DeepSeekAsk,
  MetasoAsk,
  YuanbaoAsk,
};
