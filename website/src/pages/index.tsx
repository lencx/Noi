// import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const noiVersion = '0.4.0';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={siteConfig.tagline}
      wrapperClassName="bg-amber-200/30 dark:bg-slate-700/50"
    >
      <main className="p-10 text-center max-w-[960px] m-auto">
        <h1 className="font-bold">Noi</h1>
        <p className="text-md font-bold mb-10">{siteConfig.tagline}</p>
        <div className="flex gap-10 justify-center items-end flex-row max-w-[560px] m-auto">
          <div className="flex flex-col items-center gap-1 basis-1/3">
            <img src="/os/apple-logo.svg" className="w-[40px] sm:w-[60px]" />
            <div className="font-bold">macOS</div>
            <div className="flex gap-2 justify-center">
              <a href={`https://github.com/lencx/Noi/releases/download/v${noiVersion}/Noi_macos_${noiVersion}.dmg`}>x64</a>
              <a href={`https://github.com/lencx/Noi/releases/download/v${noiVersion}/Noi_macos_${noiVersion}-arm64.dmg`}>arm64</a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 basis-1/3">
            <img src="/os/windows-logo.png" className="w-[40px] sm:w-[60px]" />
            <div className="font-bold">Windows</div>
            <div className="flex gap-2 justify-center">
              <a href={`https://github.com/lencx/Noi/releases/download/v${noiVersion}/Noi-win32-x64-${noiVersion}-setup.exe`}>x64</a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 basis-1/3">
            <img src="/os/linux-logo.png" className="w-[40px] sm:w-[60px]" />
            <div className="font-bold">Linux</div>
            <div className="flex gap-2 justify-center">
              <a href={`https://github.com/lencx/Noi/releases/download/v0.2.1/Noi_linux_0.2.1.AppImage`}>AppImage</a>
              <a href={`https://github.com/lencx/Noi/releases/download/v0.2.1/noi_linux_amd64_0.2.1.deb`}>amd64.deb</a>
            </div>
          </div>
        </div>

        <h2 className="mt-5">Preview</h2>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 max-w-[960px] m-auto">
          <img className="rounded-lg shadow-lg" src="/readme/noi-theme-dark-1.png" />
          <img className="rounded-lg shadow-lg" src="/readme/noi-theme-dark-2.png" />
          <img className="rounded-lg shadow-lg" src="/readme/noi-theme-light-1.png" />
          <img className="rounded-lg shadow-lg" src="/readme/noi-theme-light-2.png" />
          <img className="rounded-lg shadow-lg" src="/readme/noi-settings.png" />
          <img className="rounded-lg shadow-lg" src="/readme/noi-prompts.png" />
        </div>

        <h2 className="mt-5">FAQ</h2>
        <div className="text-left">
          <h3>macOS</h3>
          <p>If you encounter the error message "Noi" is damaged and can't be opened. You should move it to the Trash. while installing software on macOS, it may be due to security settings restrictions in macOS. To solve this problem, please try the following command in Terminal:</p>
          <code className="px-2">xattr -cr /Applications/Noi.app</code>
        </div>
      </main>
    </Layout>
  );
}
