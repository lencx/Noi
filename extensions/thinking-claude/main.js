class CodeBlockCollapser {
  static SELECTORS = {
    PRE: "pre",
    CODE_CONTAINER: ".code-block__code",
    MAIN_CONTAINER: ".relative.flex.flex-col",
    THINKING_LABEL: ".text-text-300",
    ORIGINAL_COPY_BTN: ".pointer-events-none",
    CODE: "code",
  };

  static CLASSES = {
    THINKING_HEADER: "thinking-header",
    COPY_CONTAINER:
      "from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md",
    COPY_BUTTON:
      "flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 hover:bg-bg-200 opacity-60 hover:opacity-100",
    COPY_TEXT: "text-text-200 pr-0.5",
    TOGGLE_BUTTON: "flex items-center text-text-500 hover:text-text-300",
    TOGGLE_LABEL: "font-medium text-sm",
    THINKING_ANIMATION: "thinking-animation",
  };

  static ANIMATION_STYLES = `
    @keyframes gradientWave {
      0% { background-position: 200% 50%; }
      100% { background-position: -200% 50%; }
    }

    .thinking-animation {
      background: linear-gradient(
        90deg,
        rgba(156, 163, 175, 0.7) 0%,
        rgba(209, 213, 219, 1) 25%,
        rgba(156, 163, 175, 0.7) 50%,
        rgba(209, 213, 219, 1) 75%,
        rgba(156, 163, 175, 0.7) 100%
      );
      background-size: 200% 100%;
      animation: gradientWave 3s linear infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
    }
  `;

  static ICONS = {
    COPY: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg>`,
    TICK: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`,
    ARROW: `<svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256" style="transition: transform 0.3s ease-in-out; margin-right: 8px;"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  };

  static TIMINGS = {
    RETRY_DELAY: 1000,
    MUTATION_DELAY: 100,
    CHECK_INTERVAL: 2000,
    COPY_FEEDBACK: 2000,
    MAX_RETRIES: 10,
  };

  constructor() {
    this.observers = new Set();
    this.injectStyles();
    this.initWithRetry();

    window.addEventListener("unload", () => this.cleanup());
  }

  injectStyles() {
    if (!document.getElementById("thinking-animation-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "thinking-animation-styles";
      styleSheet.textContent = CodeBlockCollapser.ANIMATION_STYLES;
      document.head.appendChild(styleSheet);
    }
  }

  createElement(tag, className = "", innerHTML = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  createCopyButton() {
    const container = this.createElement(
      "div",
      CodeBlockCollapser.CLASSES.COPY_CONTAINER
    );
    const button = this.createElement(
      "button",
      CodeBlockCollapser.CLASSES.COPY_BUTTON
    );
    const iconSpan = this.createElement(
      "span",
      "",
      CodeBlockCollapser.ICONS.COPY
    );
    const textSpan = this.createElement(
      "span",
      CodeBlockCollapser.CLASSES.COPY_TEXT,
      "Copy"
    );

    button.append(iconSpan, textSpan);
    container.appendChild(button);

    button.addEventListener("click", () => {
      const codeText = button
        .closest(CodeBlockCollapser.SELECTORS.PRE)
        ?.querySelector(CodeBlockCollapser.SELECTORS.CODE)?.textContent;

      if (!codeText) return;

      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          iconSpan.innerHTML = CodeBlockCollapser.ICONS.TICK;
          textSpan.textContent = "Copied!";

          setTimeout(() => {
            iconSpan.innerHTML = CodeBlockCollapser.ICONS.COPY;
            textSpan.textContent = "Copy";
          }, CodeBlockCollapser.TIMINGS.COPY_FEEDBACK);
        })
        .catch((error) => {
          console.error("Failed to copy:", error);
        });
    });

    return container;
  }

  createToggleButton(isStreaming = false) {
    const button = this.createElement(
      "button",
      CodeBlockCollapser.CLASSES.TOGGLE_BUTTON
    );
    const labelText = isStreaming ? "Thinking..." : "View thinking process";
    button.innerHTML = `
      ${CodeBlockCollapser.ICONS.ARROW}
      <span class="${CodeBlockCollapser.CLASSES.TOGGLE_LABEL}${
      isStreaming ? ` ${CodeBlockCollapser.CLASSES.THINKING_ANIMATION}` : ""
    }">${labelText}</span>
    `;
    return button;
  }

  updateHeaderState(headerContainer, isStreaming) {
    const toggleBtn = headerContainer.querySelector(
      `.${CodeBlockCollapser.CLASSES.TOGGLE_BUTTON}`
    );
    const label = toggleBtn.querySelector("span");

    label.textContent = isStreaming ? "Thinking..." : "View thinking process";

    if (isStreaming) {
      label.classList.add(CodeBlockCollapser.CLASSES.THINKING_ANIMATION);
    } else {
      label.classList.remove(CodeBlockCollapser.CLASSES.THINKING_ANIMATION);
    }
  }

  setupCodeContainer(container, toggleBtn) {
    if (!container) return;

    container.style.cssText = `
      transition: all 0.3s ease-in-out;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: 0;
      opacity: 0;
      padding: 0;
      max-width: 100%;
      display: block;
    `;

    const codeElement = container.querySelector(
      CodeBlockCollapser.SELECTORS.CODE
    );
    if (codeElement) {
      codeElement.style.cssText = `
        white-space: pre-wrap !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        display: block !important;
        max-width: 100% !important;
      `;
    }

    toggleBtn.addEventListener("click", () => {
      const shouldToggleOpen = container.style.maxHeight === "0px";
      const arrow = toggleBtn.querySelector("svg");
      const label = toggleBtn.querySelector("span");

      container.style.maxHeight = shouldToggleOpen ? "50vh" : "0";
      container.style.opacity = shouldToggleOpen ? "1" : "0";
      container.style.padding = shouldToggleOpen ? "1em" : "0";

      arrow.style.transform = `rotate(${shouldToggleOpen ? 180 : 0}deg)`;
      if (
        !label.classList.contains(CodeBlockCollapser.CLASSES.THINKING_ANIMATION)
      ) {
        label.textContent = shouldToggleOpen
          ? "Hide thinking process"
          : "View thinking process";
      }
    });
  }

  processBlock(pre) {
    const headerContainer = this.createElement(
      "div",
      CodeBlockCollapser.CLASSES.THINKING_HEADER
    );
    headerContainer.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-300);";

    const isStreaming = pre.closest('[data-is-streaming="true"]') !== null;
    const toggleBtn = this.createToggleButton(isStreaming);
    const copyBtn = this.createCopyButton();

    headerContainer.append(toggleBtn, copyBtn);

    const codeContainer = pre.querySelector(
      CodeBlockCollapser.SELECTORS.CODE_CONTAINER
    );
    this.setupCodeContainer(codeContainer, toggleBtn);

    const mainContainer = pre.querySelector(
      CodeBlockCollapser.SELECTORS.MAIN_CONTAINER
    );
    if (mainContainer) {
      const codeParent = pre.querySelector(
        CodeBlockCollapser.SELECTORS.CODE_CONTAINER
      )?.parentElement;
      if (codeParent) {
        mainContainer.insertBefore(headerContainer, codeParent);
      }

      const streamingContainer = pre.closest("[data-is-streaming]");
      if (streamingContainer) {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "data-is-streaming"
            ) {
              const isStreamingNow =
                streamingContainer.getAttribute("data-is-streaming") === "true";
              this.updateHeaderState(headerContainer, isStreamingNow);
            }
          }
        });

        observer.observe(streamingContainer, {
          attributes: true,
          attributeFilter: ["data-is-streaming"],
        });

        this.observers.add(observer);

        new MutationObserver((mutations) => {
          if (!document.contains(streamingContainer)) {
            observer.disconnect();
            this.observers.delete(observer);
          }
        }).observe(document.body, { childList: true, subtree: true });
      }

      for (const selector of [
        CodeBlockCollapser.SELECTORS.THINKING_LABEL,
        CodeBlockCollapser.SELECTORS.ORIGINAL_COPY_BTN,
      ]) {
        const element = pre.querySelector(selector);
        if (element) element.style.display = "none";
      }
    }
  }

  initWithRetry(retryCount = 0) {
    if (retryCount >= CodeBlockCollapser.TIMINGS.MAX_RETRIES) return;

    const blocks = document.querySelectorAll(CodeBlockCollapser.SELECTORS.PRE);
    if (blocks.length === 0) {
      setTimeout(
        () => this.initWithRetry(retryCount + 1),
        CodeBlockCollapser.TIMINGS.RETRY_DELAY
      );
      return;
    }

    this.processExistingBlocks();
    this.setupObserver();
    this.setupPeriodicCheck();
  }

  setupObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      for (const mutation of mutations) {
        if (
          mutation.addedNodes.length > 0 ||
          (mutation.type === "attributes" &&
            mutation.attributeName === "data-is-streaming")
        ) {
          shouldProcess = true;
        }
      }

      if (shouldProcess) {
        this.processExistingBlocks();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-is-streaming"],
    });

    this.observers.add(observer);
  }

  setupPeriodicCheck() {
    setInterval(() => {
      this.processExistingBlocks();
    }, CodeBlockCollapser.TIMINGS.CHECK_INTERVAL);
  }

  processExistingBlocks() {
    for (const pre of document.querySelectorAll(
      CodeBlockCollapser.SELECTORS.PRE
    )) {
      const header = pre.querySelector(
        CodeBlockCollapser.SELECTORS.THINKING_LABEL
      );
      if (
        header?.textContent.trim() === "thinking" &&
        !pre.querySelector(`.${CodeBlockCollapser.CLASSES.THINKING_HEADER}`)
      ) {
        this.processBlock(pre);
      }
    }
  }

  cleanup() {
    for (const observer of this.observers) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

new CodeBlockCollapser();

document.addEventListener("DOMContentLoaded", () => {
  if (!window.codeBlockCollapser) {
    window.codeBlockCollapser = new CodeBlockCollapser();
  }
});