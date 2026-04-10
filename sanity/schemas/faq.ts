import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [{ type: "block" }],
      description: "Supports bold, links, and basic formatting.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first.",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Unpublished entries are hidden from the site.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "question",
      order: "order",
      isPublished: "isPublished",
    },
    prepare({ title, order, isPublished }) {
      return {
        title: `${isPublished ? "" : "🚫 "}${title}`,
        subtitle: `#${order}`,
      };
    },
  },
});
