import type { Branch } from "@/lib/ussd/language";

/** Back one step (standard Kenyan USSD — also accepts 8). */
export const NAV_BACK = "0";
export const NAV_BACK_ALT = "8";

/** Return to main menu from anywhere. */
export const NAV_MAIN_MENU = "00";

export type NavigationResult =
  | { type: "main_menu" }
  | { type: "continue"; branch: Branch; steps: string[] }
  | { type: "back"; branch: Branch; steps: string[] };

function isBackKey(key: string): boolean {
  return key === NAV_BACK || key === NAV_BACK_ALT;
}

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

  if (isBackKey(last)) {
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
  sw: "0=Rudi  00=Menyu",
  en: "0=Back  00=Menu",
};
