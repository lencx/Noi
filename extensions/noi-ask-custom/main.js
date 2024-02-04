/**
 * NoiAskCustom: Batch send messages to AI Chat.
 */

class NoiAskCustom {
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

// TODO: Implement your custom AI Chat
// TODO: In manifest.json to match the url of your AI Chat
// ref: https://github.com/lencx/Noi/tree/main/extensions/noi-ask
class MyAsk extends NoiAskCustom {
  // TODO: Change the name and url to your AI Chat
  static name = 'MyChat';
  // TODO: Change the url to your AI Chat
  static url = '';

  // TODO: Implement the sync method
  static sync() {
     // code...
  }

  // TODO: Implement the submit method
  static submit() {
    // code...
  }
}

// Register your AI Chat class within the NoiAsk global namespace for accessibility.
window.NoiAsk = {
  ...window.NoiAsk || {},
  // TODO: Add your AI Chat class here
  MyAsk,
};
