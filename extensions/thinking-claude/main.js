class CodeBlockCollapser {
  constructor() {
    console.log("CodeBlockCollapser: Initializing..."); // Debug log
    this.initWithRetry();
  }

  initWithRetry(retryCount = 0) {
    if (retryCount > 10) {
      console.log("CodeBlockCollapser: Max retries reached"); // Debug log
      return;
    }

    const blocks = document.querySelectorAll("pre");
    if (blocks.length === 0) {
      console.log("CodeBlockCollapser: No blocks found, retrying..."); // Debug log
      setTimeout(() => this.initWithRetry(retryCount + 1), 1000);
      return;
    }

    console.log(`CodeBlockCollapser: Found ${blocks.length} blocks`); // Debug log
    this.init();
  }

  init() {
    // Initial processing
    this.processExistingBlocks();

    // Watch for new content
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
        console.log("CodeBlockCollapser: New content detected"); // Debug log
        setTimeout(() => this.processExistingBlocks(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-is-streaming"],
    });

    // Additional periodic check
    setInterval(() => {
      this.processExistingBlocks();
    }, 2000);
  }

  createCopyButton() {
    const container = document.createElement("div");
    container.className =
      "from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md";

    const button = document.createElement("button");
    button.className =
      "flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 hover:bg-bg-200 opacity-60 hover:opacity-100";

    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg>`;

    const tickIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`;

    const iconSpan = document.createElement("span");
    iconSpan.innerHTML = copyIcon;

    const textSpan = document.createElement("span");
    textSpan.className = "text-text-200 pr-0.5";
    textSpan.textContent = "Copy";

    button.appendChild(iconSpan);
    button.appendChild(textSpan);
    container.appendChild(button);

    button.addEventListener("click", async () => {
      const codeText = button
        .closest("pre")
        ?.querySelector("code")?.textContent;
      if (codeText) {
        await navigator.clipboard.writeText(codeText);
        iconSpan.innerHTML = tickIcon;
        textSpan.textContent = "Copied!";

        setTimeout(() => {
          iconSpan.innerHTML = copyIcon;
          textSpan.textContent = "Copy";
        }, 2000);
      }
    });

    return container;
  }

  processExistingBlocks() {
    document.querySelectorAll("pre").forEach((pre) => {
      const header = pre.querySelector(".text-text-300");
      if (
        header &&
        header.textContent.trim() === "thinking" &&
        !pre.querySelector(".thinking-header")
      ) {
        console.log("CodeBlockCollapser: Processing block"); // Debug log
        this.processBlock(pre);
      }
    });
  }

  processBlock(pre) {
    // Create header container
    const headerContainer = document.createElement("div");
    headerContainer.className = "thinking-header";
    headerContainer.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-300);";

    // Create toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "flex items-center text-text-500 hover:text-text-300";
    toggleBtn.innerHTML = `
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256" style="transition: transform 0.3s ease-in-out; margin-right: 8px;">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
          </svg>
          <span class="font-medium text-sm">View thinking process</span>
      `;

    // Create copy button
    const copyBtn = this.createCopyButton();

    // Add buttons to header
    headerContainer.appendChild(toggleBtn);
    headerContainer.appendChild(copyBtn);

    // Setup code container
    const codeContainer = pre.querySelector(".code-block__code");
    if (codeContainer) {
      // Set initial styles
      codeContainer.style.transition = "all 0.3s ease-in-out";
      codeContainer.style.overflow = "hidden";
      codeContainer.style.maxHeight = "0";
      codeContainer.style.opacity = "0";
      codeContainer.style.padding = "0";

      toggleBtn.addEventListener("click", () => {
        const isCollapsed = codeContainer.style.maxHeight === "0px";
        const arrow = toggleBtn.querySelector("svg");

        if (isCollapsed) {
          codeContainer.style.maxHeight = "1000px";
          codeContainer.style.opacity = "1";
          codeContainer.style.padding = "1em";
          arrow.style.transform = "rotate(180deg)";
          toggleBtn.querySelector("span").textContent = "Hide thinking process";
        } else {
          codeContainer.style.maxHeight = "0";
          codeContainer.style.opacity = "0";
          codeContainer.style.padding = "0";
          arrow.style.transform = "rotate(0deg)";
          toggleBtn.querySelector("span").textContent = "View thinking process";
        }
      });
    }

    // Add to DOM
    const mainContainer = pre.querySelector(".relative.flex.flex-col");
    if (mainContainer) {
      mainContainer.insertBefore(
        headerContainer,
        pre.querySelector(".code-block__code").parentElement
      );

      // Hide original elements
      const thinkingLabel = pre.querySelector(".text-text-300");
      const originalCopyBtn = pre.querySelector(".pointer-events-none");
      if (thinkingLabel) thinkingLabel.style.display = "none";
      if (originalCopyBtn) originalCopyBtn.style.display = "none";
    }
  }
}

// Initialize with both DOMContentLoaded and load events
document.addEventListener("DOMContentLoaded", () => {
  console.log("CodeBlockCollapser: DOMContentLoaded fired"); // Debug log
  new CodeBlockCollapser();
});

window.addEventListener("load", () => {
  console.log("CodeBlockCollapser: Load fired"); // Debug log
  new CodeBlockCollapser();
});

// Immediate initialization as well
new CodeBlockCollapser();
