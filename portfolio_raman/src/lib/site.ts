// Single source of truth for the deployed origin. Update this after pointing
// a domain at the deployment — metadata, sitemap, robots and JSON-LD all read it.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
  "https://ramanjotsingh.dev";

export const ogAlt =
  "Ramanjot Singh — Software Engineer, Gen AI. 2.5 million documents a year, classified without a human.";
