import slugify from "slugify";

/**
 * Convert text to URL-safe slug
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
  });
}

/**
 * Generate a unique slug by appending numbers if needed
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
