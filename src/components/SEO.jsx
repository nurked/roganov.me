import React from "react";
import { Helmet } from "react-helmet";
import { profile } from "../config/profile";

export const SEO = () => {
  const canonicalUrl = "https://roganov.me";

  return (
    <Helmet>
      <title>{profile.meta.title}</title>
      <meta name="description" content={profile.meta.description} />
      <meta name="keywords" content={profile.meta.keywords.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={profile.meta.title} />
      <meta property="og:description" content={profile.meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${canonicalUrl}/ivan.png`} />
      <meta property="og:site_name" content={profile.company} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={profile.meta.title} />
      <meta name="twitter:description" content={profile.meta.description} />
      <meta name="twitter:image" content={`${canonicalUrl}/ivan.png`} />

      {/* Google Analytics */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-3WR8FYRV2N"
      ></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3WR8FYRV2N');
        `}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          alternateName: profile.aliases,
          url: canonicalUrl,
          image: `${canonicalUrl}/ivan.png`,
          sameAs: [
            profile.social.linkedin,
            profile.social.medium,
            profile.social.telegram,
          ],
          jobTitle: profile.position,
          worksFor: {
            "@type": "Organization",
            name: profile.company,
            alternateName: "IFCLLC",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Clearwater",
            addressRegion: "FL",
            addressCountry: "US",
          },
          email: profile.contact.email,
          telephone: profile.contact.phone,
        })}
      </script>
    </Helmet>
  );
};
