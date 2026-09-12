import { education, experience, personal, skills } from "@/lib/data";
import { siteUrl } from "@/lib/site";

/**
 * schema.org graph for the site. Gives search engines an explicit, machine
 * readable identity — name, role, employer, education, profiles — rather than
 * leaving them to infer it from prose.
 */
export default function StructuredData() {
  const current = experience[0];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: personal.name,
        url: siteUrl,
        image: `${siteUrl}/raman.jpg`,
        jobTitle: personal.role,
        email: `mailto:${personal.email}`,
        description: personal.summary,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Delhi",
          addressCountry: "IN",
        },
        sameAs: [personal.github, personal.linkedin],
        knowsAbout: skills.flatMap((g) => g.items),
        worksFor: current && {
          "@type": "Organization",
          name: current.company,
        },
        alumniOf: education.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.school,
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${personal.name} — ${personal.role}`,
        description: personal.tagline,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: `${personal.name} — ${personal.role}`,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the one character that can break
      // out of a <script> element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
