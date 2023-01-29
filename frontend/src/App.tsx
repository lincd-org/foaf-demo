import './_tailwind.scss';
import {Link} from 'react-router-dom';
import {lazy, Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import Spinner from './components/Spinner';
import {Route, Routes} from 'react-router-dom';
import {Storage} from 'lincd/lib/utils/Storage';
import {FrontendFileStore} from 'lincd-server/lib/shapes/FrontendFileStore';

//Note that by default LINCD apps are set up with support for SCSS (sass) and CSS Modules
//So any .scss file needs to be imported by itself
import './App.scss';
//and then the .scss.json file needs to be imported to access the class names (this file will be automatically generated)
import style from './App.scss.json';

//In React 18 you can use 'lazy' to import pages only when you need them.
//This will cause webpack to create multiple bundles, and the right one is automatically loaded
const Home = lazy(() => import('./pages/Home' /* webpackPrefetch: true */));

//store all quads in a file on the backend named 'main'
export const store = new FrontendFileStore('main');
Storage.setDefaultStore(store);

declare var window;
export default function App({assets = typeof window !== 'undefined' ? window['assetManifest'] : {}}) {
  return (
    <Html assets={assets} title="foaf-test - LINCD App">
      <Suspense fallback={<Spinner />}>
        <ErrorBoundary FallbackComponent={Error}>
          <Content />
        </ErrorBoundary>
      </Suspense>
    </Html>
  );
}

function Content() {
  return (
    <Layout>
      <div className={style.content}>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Spinner />}>
                <Home />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </Layout>
  );
}

function Error({error}) {
  return (
    <div className={style.error}>
      <h1>Application Error</h1>
      <pre>{error.stack}</pre>
    </div>
  );
}

function Layout({children}) {
  return (
    <main className={style.main}>
      <Header />
      {children}
    </main>
  );
}

function Header() {
  return (
    <header className={style.header+' my-4 text-lg'}>
      {/*<nav className={style.menu}>*/}
      {/*  <Link to="/">Home</Link>*/}
      {/*  <Link to="/page1">Page 1</Link>*/}
      {/*</nav>*/}
    </header>
  );
}

function Html({assets, children, title}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/static/favicon.ico" />
        <link rel="stylesheet" href={assets['main.css']} />
        {assets['tailwind-cdn'] && <script src={assets['tailwind-cdn']}></script>}
        <title>{title}</title>
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<b>Enable JavaScript to run this app.</b>`,
          }}
        />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `assetManifest = ${JSON.stringify(assets)};`,
          }}
        />
      </body>
    </html>
  );
}
