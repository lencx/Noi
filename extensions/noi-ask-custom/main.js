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

// TODO: Implement your custom AI Chat functionalities
// The purpose of this TODO is to allow developers to add their own custom AI chat functionalities to the application. This will enable the application to support a wider range of AI chat services and provide a more personalized user experience.
// TODO: In manifest.json to match the url of your AI Chat
// The purpose of this TODO is to ensure that the URL specified in the manifest.json file matches the URL of the custom AI chat service being implemented. This is necessary for the extension to correctly identify and interact with the custom AI chat service.
// ref: https://github.com/lencx/Noi/tree/main/extensions/noi-ask
class MyAsk extends NoiAskCustom {
  // TODO: Change the name and url to your AI Chat
  // The purpose of this TODO is to update the name and URL properties of the custom AI chat class to match the specific AI chat service being implemented. This ensures that the application correctly identifies and interacts with the custom AI chat service.
  static name = 'MyChat';
  // TODO: Change the url to your AI Chat
  // The purpose of this TODO is to update the URL property of the custom AI chat class to match the specific AI chat service being implemented. This ensures that the application correctly identifies and interacts with the custom AI chat service.
  static url = '';

  // TODO: Implement the sync method
  // The purpose of this TODO is to implement the sync method for the custom AI chat class. This method should handle the synchronization of messages between the application and the custom AI chat service.
  static sync() {
     // code...
  }

  // TODO: Implement the submit method
  // The purpose of this TODO is to implement the submit method for the custom AI chat class. This method should handle the submission of messages from the application to the custom AI chat service.
  static submit() {
    // code...
  }
}

// Register your AI Chat class within the NoiAsk global namespace for accessibility.
window.NoiAsk = {
  ...window.NoiAsk || {},
  // TODO: Add your AI Chat class here
  // The purpose of this TODO is to add the custom AI chat class to the global NoiAsk namespace. This makes the custom AI chat class accessible throughout the application.
  MyAsk,
};

// TODO: Identify and list all the TODO code comments throughout the entire codebase
// The purpose of this TODO is to identify and list all the TODO comments in the codebase. This helps in tracking pending tasks and ensures that all necessary changes and improvements are made to the code.
