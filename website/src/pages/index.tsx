// import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={siteConfig.tagline}
    >
      <main className="p-10 text-center bg-amber-200/30 dark:bg-slate-700/50">
        <h1 className="font-bold">Noi</h1>
        <p className="text-md font-bold mb-10">{siteConfig.tagline}</p>
        <div className="flex justify-center gap-10">
          <div>
            <img src="/img/apple-logo.svg" className="w-24 h-24 mx-auto mb-4" />
            <p>macOS</p>
          </div>
          <div>
            <img src="/img/windows-logo.png" className="w-24 h-24 mx-auto mb-4" />
            <p>Windows</p>
          </div>
          <div>
            <img src="/img/linux-logo.png" className="w-24 h-24 mx-auto mb-4" />
            <p>Linux</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
          <img className="rounded-lg shadow-lg mb-4" src="/img/noi-preview-1.png" />
          <img className="rounded-lg shadow-lg" src="/img/noi-preview-2.png" />
        </div>
      </main>
    </Layout>
  );
}
