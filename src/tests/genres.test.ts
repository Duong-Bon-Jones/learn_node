import { testClient } from "hono/testing";
import { describe, it, expect } from "vitest";
import genresRoute from "../routes/genres.js";

describe("Genres Endpoint", () => {
  const client = testClient(genresRoute);

  it("/ should return all genres", async () => {
    const res = await client.index.$get();

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("genres");

    if (data.genres.length > 0) {
      const genreObject = data.genres[0];
      expect(genreObject).toHaveProperty("created_at");
      expect(genreObject).toHaveProperty("id");
      expect(genreObject).toHaveProperty("name");
      expect(genreObject).toHaveProperty("updated_at");
    }
  });

  it("/:id should return the genre with given id", async () => {
    const res = await client[":id"].$get({ param: { id: "1" } });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("genre");
  });
});
