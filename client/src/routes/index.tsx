import { getGenres } from "@/libs/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: getGenres,
});

function Home() {
  const { genres } = Route.useLoaderData();

  console.log("fake Change");

  return (
    <ul>
      {genres.map((g) => (
        <li key={g.id}>
          <a href={`${g.id}`}>{g.name}</a>
        </li>
      ))}
    </ul>
  );
}
