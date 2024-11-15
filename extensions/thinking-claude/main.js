class CodeBlockCollapser {
  static SELECTORS = {
    PRE: 'pre',
    CODE_CONTAINER: '.code-block__code',
    MAIN_CONTAINER: '.relative.flex.flex-col',
    THINKING_LABEL: '.text-text-300',
    ORIGINAL_COPY_BTN: '.pointer-events-none',
    CODE: 'code'
  };

  static CLASSES = {
    THINKING_HEADER: 'thinking-header',
    COPY_CONTAINER: 'from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md',
    COPY_BUTTON: 'flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 hover:bg-bg-200 opacity-60 hover:opacity-100',
    COPY_TEXT: 'text-text-200 pr-0.5',
    TOGGLE_BUTTON: 'flex items-center text-text-500 hover:text-text-300',
    TOGGLE_LABEL: 'font-medium text-sm'
  };

  static ICONS = {
    COPY: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg>`,
    TICK: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`,
    ARROW: `<svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256" style="transition: transform 0.3s ease-in-out; margin-right: 8px;"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>`
  };

  static TIMINGS = {
    RETRY_DELAY: 1000,
    MUTATION_DELAY: 100,
    CHECK_INTERVAL: 2000,
    COPY_FEEDBACK: 2000,
    MAX_RETRIES: 10
  };

  static STYLES = {
    HEADER: 'display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-300);',
    CODE_CONTAINER: `
      transition: all 0.3s ease-in-out;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      padding: 0;
      max-width: 100%;
      display: block;
    `,
    CODE_ELEMENT: `
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      display: block !important;
      max-width: 100% !important;
    `
  };

  constructor() {
    this.initWithRetry();
  }

  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  async initWithRetry(retryCount = 0) {
    if (retryCount >= CodeBlockCollapser.TIMINGS.MAX_RETRIES) {
      return;
    }

    const blocks = document.querySelectorAll(CodeBlockCollapser.SELECTORS.PRE);
    if (blocks.length === 0) {
      await new Promise(resolve =>
        setTimeout(resolve, CodeBlockCollapser.TIMINGS.RETRY_DELAY)
      );
      return this.initWithRetry(retryCount + 1);
    }

    this.init();
  }

  init() {
    this.processExistingBlocks();

    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      mutations.forEach((mutation) => {
        if (
          mutation.addedNodes.length > 0 ||
          (mutation.type === "attributes" &&
            mutation.attributeName === "data-is-streaming")
        ) {
          shouldProcess = true;
        }
      });

      if (shouldProcess) {
        this.processExistingBlocks();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-is-streaming"]
    });

    setInterval(() => {
      this.processExistingBlocks();
    }, 2000);
  }

  setupObserver() {
    const observer = new MutationObserver(this.handleMutations.bind(this));
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-is-streaming']
    });
  }

  setupPeriodicCheck() {
    setInterval(() => {
      if (!this.processingTimeout) {
        this.processExistingBlocks();
      }
    }, CodeBlockCollapser.TIMINGS.CHECK_INTERVAL);
  }

  handleMutations(mutations) {
    const hasRelevantChanges = mutations.some(mutation =>
      mutation.addedNodes.length > 0 ||
      (mutation.type === 'attributes' && mutation.attributeName === 'data-is-streaming')
    );

    if (hasRelevantChanges) {
      this.debouncedProcess();
    }
  }

  debouncedProcess() {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
    }

    this.processingTimeout = setTimeout(() => {
      this.processExistingBlocks();
      this.processingTimeout = null;
    }, CodeBlockCollapser.TIMINGS.MUTATION_DELAY);
  }

  async createCopyButton() {
    const container = this.createElement('div', CodeBlockCollapser.CLASSES.COPY_CONTAINER);
    const button = this.createElement('button', CodeBlockCollapser.CLASSES.COPY_BUTTON);
    const iconSpan = this.createElement('span', '', CodeBlockCollapser.ICONS.COPY);
    const textSpan = this.createElement('span', CodeBlockCollapser.CLASSES.COPY_TEXT, 'Copy');

    button.append(iconSpan, textSpan);
    container.appendChild(button);

    button.addEventListener('click', async () => {
      const codeText = button.closest(CodeBlockCollapser.SELECTORS.PRE)
        ?.querySelector(CodeBlockCollapser.SELECTORS.CODE)?.textContent;

      if (!codeText) return;

      try {
        await navigator.clipboard.writeText(codeText);
        iconSpan.innerHTML = CodeBlockCollapser.ICONS.TICK;
        textSpan.textContent = 'Copied!';

        setTimeout(() => {
          iconSpan.innerHTML = CodeBlockCollapser.ICONS.COPY;
          textSpan.textContent = 'Copy';
        }, CodeBlockCollapser.TIMINGS.COPY_FEEDBACK);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    });

    return container;
  }

  createToggleButton() {
    const button = this.createElement('button', CodeBlockCollapser.CLASSES.TOGGLE_BUTTON);
    button.innerHTML = `
      ${CodeBlockCollapser.ICONS.ARROW}
      <span class="${CodeBlockCollapser.CLASSES.TOGGLE_LABEL}">View thinking process</span>
    `;
    return button;
  }

  processExistingBlocks() {
    document.querySelectorAll(CodeBlockCollapser.SELECTORS.PRE).forEach(pre => {
      const header = pre.querySelector(CodeBlockCollapser.SELECTORS.THINKING_LABEL);
      if (header?.textContent.trim() === 'thinking' &&
          !pre.querySelector(`.${CodeBlockCollapser.CLASSES.THINKING_HEADER}`)) {
        this.processBlock(pre);
      }
    });
  }

  setupCodeContainer(container, toggleBtn) {
    if (!container) return;

    container.style.cssText = CodeBlockCollapser.STYLES.CODE_CONTAINER;

    const codeElement = container.querySelector(CodeBlockCollapser.SELECTORS.CODE);
    if (codeElement) {
      codeElement.style.cssText = CodeBlockCollapser.STYLES.CODE_ELEMENT;
    }

    this.setupToggleHandler(toggleBtn, container);
  }

  setupToggleHandler(toggleBtn, codeContainer) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = codeContainer.style.maxHeight === '0px';
      const arrow = toggleBtn.querySelector('svg');
      const label = toggleBtn.querySelector('span');

      Object.assign(codeContainer.style, {
        maxHeight: isCollapsed ? '1000px' : '0',
        opacity: isCollapsed ? '1' : '0',
        padding: isCollapsed ? '1em' : '0'
      });

      arrow.style.transform = `rotate(${isCollapsed ? 180 : 0}deg)`;
      label.textContent = isCollapsed ? 'Hide thinking process' : 'View thinking process';
    });
  }

  async processBlock(pre) {
    const headerContainer = this.createElement('div', CodeBlockCollapser.CLASSES.THINKING_HEADER);
    headerContainer.style.cssText = CodeBlockCollapser.STYLES.HEADER;

    const toggleBtn = this.createToggleButton();
    const copyBtn = await this.createCopyButton();

    headerContainer.append(toggleBtn, copyBtn);

    const codeContainer = pre.querySelector(CodeBlockCollapser.SELECTORS.CODE_CONTAINER);
    this.setupCodeContainer(codeContainer, toggleBtn);

    const mainContainer = pre.querySelector(CodeBlockCollapser.SELECTORS.MAIN_CONTAINER);
    if (mainContainer) {
      const codeParent = pre.querySelector(CodeBlockCollapser.SELECTORS.CODE_CONTAINER)?.parentElement;
      if (codeParent) {
        mainContainer.insertBefore(headerContainer, codeParent);
      }

      [CodeBlockCollapser.SELECTORS.THINKING_LABEL, CodeBlockCollapser.SELECTORS.ORIGINAL_COPY_BTN]
        .forEach(selector => {
          const element = pre.querySelector(selector);
          if (element) element.style.display = 'none';
        });
    }
  }
}

new CodeBlockCollapser();

document.addEventListener("DOMContentLoaded", () => {
  if (!window.codeBlockCollapser) {
    window.codeBlockCollapser = new CodeBlockCollapser();
  }
});