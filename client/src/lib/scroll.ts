/**
 * Smooth-scroll to a section on the current page, offset by the fixed navbar
 * height so the section heading isn't hidden underneath it.
 *
 * Several components previously duplicated this logic inline; keep it here so
 * the nav-offset math lives in exactly one place.
 */
export function scrollToSection(sectionId: string, extraOffset = 20): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const nav = document.querySelector("nav");
  const navHeight = nav?.getBoundingClientRect().height ?? 80;
  const top = element.offsetTop - navHeight - extraOffset;

  window.scrollTo({ top, behavior: "smooth" });
}
