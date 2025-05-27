import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags for SEO */}
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Modern art gallery showcasing creative works and artistic expression"
        />
        <meta
          name="keywords"
          content="art, gallery, paintings, digital art, artist, creative, artwork"
        />
        <meta name="author" content="Art Gallery" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Art Gallery - Showcase of Creative Works"
        />
        <meta
          property="og:description"
          content="Explore a stunning collection of artworks across various mediums and styles"
        />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="Art Gallery - Showcase of Creative Works"
        />
        <meta
          property="twitter:description"
          content="Explore a stunning collection of artworks across various mediums and styles"
        />
        <meta property="twitter:image" content="/og-image.jpg" />

        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preload fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          as="style"
        />

        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </Head>
      <body className="bg-black text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}