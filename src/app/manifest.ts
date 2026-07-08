import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EduCenter",
    short_name: "EduCenter",
    description: "منصة شاملة تساعدك على إدارة طلابك، معلميك، الدروس، الاختبارات، والتقارير في مكان واحد بكل سهولة واحترافية.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1E4632",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
