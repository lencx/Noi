# Noi Configs

## Noi Mode

To set up a custom sync link, follow the steps below:

- **Step 1**: Open the settings (on macOS: `cmd`+`,`, on Windows: `ctrl`+`,`)
- **Step 2**: Edit the URL in `Mode Sync`
- **Step 3** or **Step 4**: Click the `sync` button to start synchronizing data

> [!NOTE]
> The `custom url` will not be overwritten. If you wish to use your own URL as a data source, please refer to the data format in `noi.mode.json`.

![Mode Sync](../website/static/configs/mode-sync.jpg)

### Sync URL

- [AI](./noi.mode.json): Popular AI websites and communities (e.g., ChatGPT, Gemini, Claude, Poe, etc.).

  ```bash
  https://raw.githubusercontent.com/lencx/Noi/main/configs/noi.mode.json
  ```

- [AI（内陆版）](./noi.mode.cn.json): 主流 AI 及国内 AI（如：通义千问、扣子、豆包、智谱清言、讯飞星火、文心一言等）。

  ```bash
  https://raw.githubusercontent.com/lencx/Noi/main/configs/noi.mode.cn.json
  ```

### noi.mode.json

Here is a detailed description of some fields:

- `name`: Name (optional, has no significance)
- `version`: Version change
- `sync`: URL information (optional, has no significance)
- `modes[]`:
  - `id`: A unique identifier (use a random string; do not use formats like `noi:xxx` or `noi@xxx` as these are reserved for internal use within Noi)
  - `parent`: The parent folder this item belongs to (supports nesting)
  - `text`: Name
  - `url`: Link
  - `dir`: Whether it is a folder, default is `false`

## Proxy

Learn more: [electronjs/docs](https://www.electronjs.org/docs/latest/api/session#sessetproxyconfig)

- `proxyRules`: Rules indicating which proxies to use.
- `proxyBypassRules`: Rules indicating which URLs should bypass the proxy settings.
