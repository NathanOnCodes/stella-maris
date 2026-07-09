import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vox Regina Caeli",
    short_name: "Vox RC",
    description:
      "Revista digital católica independente com conteúdo editorial sobre notícias da Igreja, espiritualidade, apologética e entrevistas.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7C2D12",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
