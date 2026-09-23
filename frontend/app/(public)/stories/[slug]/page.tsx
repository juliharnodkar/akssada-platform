import { notFound } from "next/navigation";

// No story data source exists yet (Stories are a backend feature added in
// a later phase). This route is scaffolded now so the URL pattern and
// component location are settled, but it intentionally 404s until real
// story content is wired in — nothing on the site links here yet.
export default function StoryDetailPage() {
  notFound();
}
