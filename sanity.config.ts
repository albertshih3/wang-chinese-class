import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import * as schemas from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "wang-laoshi-studio",
  title: "Wang Laoshi — Content Studio",

  projectId,
  dataset,
  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singletons — directly open (no document list)
            S.listItem()
              .title("Home Page")
              .id("homePage")
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId("homePage")
              ),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Teacher Bio")
              .id("teacherBio")
              .child(
                S.document()
                  .schemaType("teacherBio")
                  .documentId("teacherBio")
              ),
            S.divider(),
            // Collections
            S.documentTypeListItem("announcement").title("Announcements"),
            S.documentTypeListItem("faq").title("FAQ Entries"),
          ]),
    }),
  ],

  schema: {
    types: Object.values(schemas),
  },
});
