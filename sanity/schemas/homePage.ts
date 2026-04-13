import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  // Singleton — only one document of this type should exist
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      description: 'Small label above the headline. e.g. "Mandarin Chinese for Young Learners"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineMain",
      title: "Headline (main text)",
      type: "string",
      description: 'The main part of the H1. e.g. "Learning Mandarin feels like"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineHighlight",
      title: "Headline (highlighted word)",
      type: "string",
      description: 'The word rendered in the accent color. e.g. "home"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "text",
      rows: 2,
      description: "Supporting sentence beneath the headline.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCta",
      title: "Primary CTA Button",
      type: "string",
      description: 'e.g. "Request a Consultation"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSecondaryButton",
      title: "Secondary Button",
      type: "string",
      description: 'e.g. "Meet the Teacher"',
      validation: (Rule) => Rule.required(),
    }),

    // ── Features ──────────────────────────────────────────────────────────────
    defineField({
      name: "feature1Title",
      title: "Feature 1 — Title",
      type: "string",
      group: "features",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feature1Body",
      title: "Feature 1 — Body",
      type: "text",
      rows: 2,
      group: "features",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feature2Title",
      title: "Feature 2 — Title",
      type: "string",
      group: "features",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feature2Body",
      title: "Feature 2 — Body",
      type: "text",
      rows: 2,
      group: "features",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feature3Title",
      title: "Feature 3 — Title",
      type: "string",
      group: "features",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feature3Body",
      title: "Feature 3 — Body",
      type: "text",
      rows: 2,
      group: "features",
      validation: (Rule) => Rule.required(),
    }),

    // ── Teacher Teaser ────────────────────────────────────────────────────────
    defineField({
      name: "teacherTeaserLabel",
      title: "Teacher Teaser — Eyebrow Label",
      type: "string",
      description: 'Small label above the teacher name. e.g. "Meet the Teacher"',
      group: "teacherTeaser",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "teacherName",
      title: "Teacher Teaser — Display Name",
      type: "string",
      description: 'e.g. "Wang Laoshi"',
      group: "teacherTeaser",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "teacherTeaserBody",
      title: "Teacher Teaser — Body",
      type: "text",
      rows: 2,
      description: "Short intro sentence in the teacher teaser block.",
      group: "teacherTeaser",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "teacherTeaserLinkText",
      title: "Teacher Teaser — Link Text",
      type: "string",
      description: 'e.g. "Learn more about Wang Laoshi"',
      group: "teacherTeaser",
      validation: (Rule) => Rule.required(),
    }),

    // ── CTA Band ──────────────────────────────────────────────────────────────
    defineField({
      name: "ctaBandHeading",
      title: "CTA Band — Heading",
      type: "string",
      description: 'e.g. "Ready to get started?"',
      group: "ctaBand",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaBandBody",
      title: "CTA Band — Body",
      type: "text",
      rows: 2,
      group: "ctaBand",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaBandButton",
      title: "CTA Band — Button Text",
      type: "string",
      group: "ctaBand",
      validation: (Rule) => Rule.required(),
    }),
  ],
  groups: [
    { name: "features", title: "Features" },
    { name: "teacherTeaser", title: "Teacher Teaser" },
    { name: "ctaBand", title: "CTA Band" },
  ],
  preview: {
    select: { title: "headlineMain", subtitle: "headlineHighlight" },
    prepare({ title, subtitle }) {
      return { title: `${title} ${subtitle}` };
    },
  },
});
