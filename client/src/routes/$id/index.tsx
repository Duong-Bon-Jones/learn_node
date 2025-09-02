import { getGenre } from "@/libs/api";
import { Genre } from "@server/db/schema/genreSchema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$id/")({
  component: RouteComponent,
  loader: (c) => getGenre(c.params.id),
});

function RouteComponent() {
  const { genre } = Route.useLoaderData() as { genre: Genre };

  return (
    <div>
      {genre.name} - {new Date(genre.created_at).toLocaleDateString()}
    </div>
  );
}
