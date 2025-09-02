import { hc } from "hono/client";
import type { AppType } from "@server/index";

const { api } = hc<AppType>("http://localhost:3001/");

export const getGenres = async () => {
  const res = await api.genres.$get();

  if (!res.ok) {
    throw new Error("Server error");
  }

  return await res.json();
};

export const getGenre = async (id: string) => {
  const res = await api.genres[":id"].$get({ param: { id } });

  if (!res.ok) {
    throw new Error("Server error");
  }

  return await res.json();
};
