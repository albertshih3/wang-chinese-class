import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type should exist
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      description: "Displayed in the browser tab and site header.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      description: "Your email address for consultation notifications.",
    }),
    defineField({
      name: "zoomLink",
      title: "Zoom Meeting Link",
      type: "url",
      description: "Recurring Zoom URL shared with enrolled families.",
    }),
    defineField({
      name: "googleClassroomUrl",
      title: "Google Classroom URL",
      type: "url",
      description: "Invite or join link for Google Classroom.",
    }),
    defineField({
      name: "sampleClassVideoUrl",
      title: "Sample Class Video URL",
      type: "url",
      description: "Optional YouTube or Vimeo URL for a preview video.",
    }),
  ],
  preview: {
    select: { title: "siteName" },
  },
});
