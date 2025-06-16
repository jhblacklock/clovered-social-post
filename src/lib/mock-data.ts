export const brandConfig = {
  brand_name: "CloverEd",
  logo_url: "https://clovered.org/wp-content/uploads/2024/03/clovered-logo-green.svg",
  primary_color: "#2BA30A",
  secondary_color: "#10305C",
  accent_color: "#4DC5C1",
  font_family: "Open Sans",
  text_color: "#111111",
  overlay_style: {
    headline_font_size: 64,
    subhead_font_size: 32,
    text_color: "#FFFFFF",
    background_overlay_color: "rgba(16, 48, 92, 0.75)",
    text_shadow: true,
    logo_position: "bottom-right",
    padding: 32
  },
  image_style: {
    vibe: "Warm, professional, trustworthy",
    keywords: ["education", "mental health", "community", "students", "faculty", "rural college"],
    image_tone: "Natural light, soft focus, inclusive visuals"
  },
  default_cta: "Learn More",
  platform_overrides: {
    instagram: {
      text_limit: 2200,
      preferred_image_size: "1080x1350"
    },
    linkedin: {
      text_limit: 3000,
      preferred_image_size: "1200x1350"
    },
    x: {
      text_limit: 280,
      preferred_image_size: "1600x900"
    },
    facebook: {
      text_limit: 2000,
      preferred_image_size: "1200x630"
    }
  }
} as const; 