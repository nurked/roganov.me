<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS feed</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <style>
          body {
            font-family: ui-sans-serif, system-ui, -apple-system, Inter, sans-serif;
            max-width: 720px;
            margin: 0 auto;
            padding: 3rem 1.5rem;
            background: #0A0F1A;
            color: #D1D5DB;
            line-height: 1.6;
          }
          header {
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding-bottom: 2rem;
            margin-bottom: 2.5rem;
          }
          .eyebrow {
            color: #22D3EE;
            font-family: ui-monospace, monospace;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin: 0 0 0.75rem;
          }
          h1 {
            color: #fff;
            font-size: 2.25rem;
            margin: 0 0 1rem;
            letter-spacing: -0.02em;
          }
          .subtitle {
            color: #9CA3AF;
            margin: 0 0 1.5rem;
          }
          .subscribe {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-family: ui-monospace, monospace;
            font-size: 0.875rem;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            color: #D1D5DB;
          }
          .subscribe code { color: #22D3EE; }
          article {
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 1.5rem 0;
          }
          article h2 {
            margin: 0 0 0.5rem;
            font-size: 1.25rem;
            letter-spacing: -0.01em;
          }
          article a { color: #fff; text-decoration: none; }
          article a:hover { color: #22D3EE; }
          time {
            color: #6B7280;
            font-family: ui-monospace, monospace;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .desc {
            color: #9CA3AF;
            margin: 0.5rem 0 0;
            font-size: 0.95rem;
          }
          .tags {
            margin-top: 0.75rem;
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            color: #6B7280;
            font-family: ui-monospace, monospace;
            font-size: 0.75rem;
          }
          .back {
            display: inline-block;
            margin-top: 2rem;
            color: #9CA3AF;
            font-family: ui-monospace, monospace;
            font-size: 0.875rem;
            text-decoration: none;
          }
          .back:hover { color: #22D3EE; }
        </style>
      </head>
      <body>
        <header>
          <p class="eyebrow">RSS feed</p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="subtitle"><xsl:value-of select="/rss/channel/description"/></p>
          <span class="subscribe">
            Subscribe with any reader at
            <code><xsl:value-of select="/rss/channel/atom:link/@href"/></code>
          </span>
        </header>

        <main>
          <xsl:for-each select="/rss/channel/item">
            <article>
              <time><xsl:value-of select="substring(pubDate, 1, 16)"/></time>
              <h2>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="desc"><xsl:value-of select="description"/></p>
              <xsl:if test="category">
                <div class="tags">
                  <xsl:for-each select="category">
                    <span>#<xsl:value-of select="."/></span>
                  </xsl:for-each>
                </div>
              </xsl:if>
            </article>
          </xsl:for-each>
        </main>

        <a class="back" href="/blog/">&#8592; Back to the site</a>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
