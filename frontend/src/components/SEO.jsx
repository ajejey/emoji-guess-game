import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Guess the Emoji';
const DEFAULT_DESCRIPTION = 'Play fun emoji guess games and more online with friends and family. Guess movie titles, phrases, and more from emoji combinations!';
const DEFAULT_TITLE = `${SITE_NAME}: Multiplayer Party Game`;

const SEO = ({ 
  title,
  description,
  canonicalUrl,
  keywords = 'emoji game, guess the emoji, emoji quiz, emoji puzzle, emoji riddles, multiplayer game, party game, team building, online game',
  ogType = 'website',
  ogImage = '/og-image.jpg', // Will create this image later
  children
}) => {
  const effectiveTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const effectiveDescription = description || DEFAULT_DESCRIPTION;

  // Build the full canonical URL
  const siteUrl = import.meta.env.VITE_FRONTEND_URL || 'https://emoji-guess-game-seven.vercel.app';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{effectiveTitle}</title>
      <meta name="description" content={effectiveDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={effectiveTitle} />
      <meta property="og:description" content={effectiveDescription} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={effectiveTitle} />
      <meta name="twitter:description" content={effectiveDescription} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional SEO-friendly meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Ajey Nagarkatti" />
      <meta name="language" content="English" />
      <meta name="google-adsense-account" content="ca-pub-3613850686549619" />
      
      {/* Structured Data / Schema.org markup for Game */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Game",
          "name": effectiveTitle,
          "description": effectiveDescription,
          "url": fullCanonicalUrl,
          "image": `${siteUrl}${ogImage}`,
          "author": {
            "@type": "Person",
            "name": "Ajey Nagarkatti"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Family, Friends, Teams"
          },
          "gameItem": {
            "@type": "Thing",
            "name": "Emoji Puzzles"
          },
          "numberOfPlayers": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 20
          }
        })}
      </script>
      
      {children}
    </Helmet>
  );
};

export default SEO;
