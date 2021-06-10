import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import "../styles/main.scss";
import Head from 'next/head';
import React from 'react';



function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <title>Salase</title>
        <meta name='description' content='Bivy and Huts in Slovak Mountains' />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
    )
}

export default MyApp
