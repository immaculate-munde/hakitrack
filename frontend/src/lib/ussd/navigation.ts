import type { Branch } from "@/lib/ussd/language";

/** Single key — back one step (or main menu if at branch entry). */
export const NAV_BACK = "8";

/** Double zero — return to main menu from anywhere. */
export const NAV_MAIN_MENU = "00";

export type NavigationResult =
  | { type: "main_menu" }
  | { type: "continue"; branch: Branch; steps: string[] }
  | { type: "back"; branch: Branch; steps: string[] };

export function applyNavigation(
  branch: Branch,
  steps: string[],
): NavigationResult {
  if (steps.length === 0) {
    return { type: "continue", branch, steps };
  }

  const last = steps[steps.length - 1];

  if (last === NAV_MAIN_MENU) {
    return { type: "main_menu" };
  }

  if (last === NAV_BACK) {
    const withoutNav = steps.slice(0, -1);
    if (withoutNav.length === 0) {
      return { type: "main_menu" };
    }
    return {
      type: "back",
      branch,
      steps: withoutNav.slice(0, -1),
    };
  }

  return { type: "continue", branch, steps };
}

export const NAV_HINT: Record<"sw" | "en", string> = {
  sw: "8=Rudi  00=Menyu",
  en: "8=Back  00=Menu",
};

export const EXIT_HINT: Record<"sw" | "en", string> = {
  sw: "0=Toka",
  en: "0=Exit",
};
