import { defineField, defineType } from "sanity";

export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      description: "For your reference only — not shown on the site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Banner Message",
      type: "text",
      rows: 2,
      description: "The text displayed to visitors on the banner.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: {
        list: [
          { title: "Info (blue)", value: "info" },
          { title: "Warning (amber)", value: "warning" },
          { title: "Success (green)", value: "success" },
        ],
        layout: "radio",
      },
      initialValue: "info",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Toggle off to hide without deleting.",
      initialValue: true,
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      description: "Banner auto-hides after this date and time.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "message",
      isActive: "isActive",
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: `${isActive ? "✅" : "⏸"} ${title}`,
        subtitle,
      };
    },
  },
});
