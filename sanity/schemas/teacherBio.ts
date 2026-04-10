import { defineField, defineType } from "sanity";

export const teacherBio = defineType({
  name: "teacherBio",
  title: "Teacher Bio",
  type: "document",
  // Singleton — only one document of this type should exist
  fields: [
    defineField({
      name: "name",
      title: "Display Name",
      type: "string",
      description: "e.g. Wendy Wang 王老師",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headshot",
      title: "Headshot Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the photo for accessibility.",
        }),
      ],
    }),
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "1–2 sentences shown on the home page teaser.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullBio",
      title: "Full Bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich-text bio shown on the About page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "credentials",
      title: "Education & Experience",
      type: "array",
      of: [{ type: "string" }],
      description: "Each entry becomes a line item with a checkmark.",
    }),
    defineField({
      name: "specialties",
      title: "Specialties",
      type: "array",
      of: [{ type: "string" }],
      description: "Badge tags shown in the Specialties section.",
    }),
    defineField({
      name: "textbooks",
      title: "Textbooks Used",
      type: "array",
      of: [{ type: "string" }],
      description: "Outline badge tags shown under Specialties.",
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
