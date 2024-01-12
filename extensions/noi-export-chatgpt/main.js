const icons = {
  check: `<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 16.2l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"/></svg>`,
  noCheck: `<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5z"/></svg>`,
}

const QUERY_CHAT_LIST = 'main [role="presentation"] div[data-testid]';
const QUERY_CHECKBOX_AREA = '.empty\\:hidden div.visible';
const QUERY_ACTION_BUTTON = '.empty\\:hidden div.visible button';

window.noiExport = function() {
  const allNodes = Array.from(document.querySelectorAll(QUERY_CHAT_LIST));
  if (!allNodes.length) {
    return {
      selected: [],
      all: [],
    };
  }

  return {
    selected: window._noiSelectedNodes,
    all: allNodes.map((el) => {
      const node = el.cloneNode(true);
      const msgNode = node.querySelector('[data-message-author-role]');
      if (msgNode) {
        msgNode.className = 'whitespace-pre-wrap break-words';
      }
      return node;
    }),
  };
}

// ------------------------------

window.addEventListener('load', () => {
  window._noiSelectedNodes = [];
  const debouncedHandleMainChanges = debounce(handleMainChanges, 250);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (!mutation.target.form) {
        debouncedHandleMainChanges();
      }
    });
  });

  const mainElement = document.querySelector('main');
  observer.observe(mainElement, { childList: true, subtree: true });

  debouncedHandleMainChanges();

  changeURL(() => {
    window._noiSelectedNodes = [];
  });
})

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

function createButtonForNode(i, index, nodesMap) {
  i.setAttribute('noi-node-id', index);
  nodesMap.set(index, i);

  const btnArea = i.querySelector(QUERY_CHECKBOX_AREA);
  if (!btnArea) return;

  if (btnArea.querySelector('button.noi-checkbox')) return;

  const defaultBtn = i.querySelector(QUERY_ACTION_BUTTON);
  if (!defaultBtn) return;

  const btn = document.createElement('button');
  btn.classList.add(...defaultBtn.classList, 'noi-checkbox');
  btn.innerHTML = icons.noCheck;
  btn.setAttribute('data-checked', 'false');

  btn.onclick = () => {
    const isChecked = btn.getAttribute('data-checked') === 'true';
    btn.innerHTML = isChecked ? icons.noCheck : icons.check;
    btn.setAttribute('data-checked', `${!isChecked}`);
    i.classList.toggle('noi-selected', !isChecked);
    updateSelectedNodes(isChecked, i.cloneNode(true), nodesMap);
  }

  btnArea.insertBefore(btn, btnArea.firstChild);
}

function updateSelectedNodes(isChecked, node, nodesMap) {
  const nodeId = node.getAttribute('noi-node-id');
  const indexInAll = nodesMap.get(Number(nodeId));
  const indexInSelected = window._noiSelectedNodes.findIndex(n => n.getAttribute('noi-node-id') === nodeId);

  if (!isChecked) {
    if (indexInSelected === -1) {
      let inserted = false;
      for (let i = 0; i < window._noiSelectedNodes.length; i++) {
        const currentId = window._noiSelectedNodes[i].getAttribute('noi-node-id');
        if (nodesMap.get(Number(currentId)) > indexInAll) {
          window._noiSelectedNodes.splice(i, 0, node);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        const msgNode = node.querySelector('[data-message-author-role]');
        if (msgNode) {
          msgNode.className = 'whitespace-pre-wrap break-words';
        }
        window._noiSelectedNodes.push(node);
      }
    }
  } else {
    if (indexInSelected > -1) {
      window._noiSelectedNodes.splice(indexInSelected, 1);
    }
  }
  window._noiSelectedNodes.sort((a, b) => {
    const nodeIdA = a.getAttribute('noi-node-id');
    const nodeIdB = b.getAttribute('noi-node-id');
    return Number(nodeIdA) - Number(nodeIdB);
  });
  console.log(window._noiSelectedNodes);
}

function handleMainChanges() {
  const nodesMap = new Map();
  document.querySelectorAll(QUERY_CHAT_LIST)
    .forEach((node, index) => createButtonForNode(node, index, nodesMap));
}

(function (history) {
  function triggerEvent(eventName, state) {
    if (typeof history[eventName] === 'function') {
      history[eventName]({ state: state, url: window.location.href });
    }
  }

  function overrideHistoryMethod(methodName, eventName) {
    const originalMethod = history[methodName];
    history[methodName] = function (state, ...rest) {
      const result = originalMethod.apply(this, [state, ...rest]);
      triggerEvent(eventName, state);
      return result;
    };
  }

  overrideHistoryMethod('pushState', 'onpushstate');
  overrideHistoryMethod('replaceState', 'onreplacestate');

  window.addEventListener('popstate', () => {
    triggerEvent('onpopstate', null);
  });
})(window.history);

function changeURL(callback) {
  window.history.onpushstate = (event) => {
    console.log('pushState called:', event.url);
    callback && callback(event);
  };
  window.history.onreplacestate = (event) => {
    console.log('replaceState called:', event.url);
    callback && callback(event);
  };
  window.history.onpopstate = (event) => {
    console.log('popstate event triggered', window.location.href);
    callback && callback(event);
  };
}
