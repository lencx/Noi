if (navigator.platform.toUpperCase().indexOf('MAC') < 0) {
  const style = document.createElement('style');
  style.innerHTML = `
    html {
      --noi-scrollbarBG: rgba(250, 250, 250, 0.1);
      --noi-thumbBG: #d8d8d8;
    }
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    ::-webkit-scrollbar-track {
      background: var(--noi-scrollbarBG);
      border-radius: 2px;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: var(--noi-thumbBG);
    }
  `;
  document.head.appendChild(style);
}
