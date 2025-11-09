import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}