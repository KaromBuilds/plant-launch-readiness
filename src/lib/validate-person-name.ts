export const PERSON_NAME_MIN = 2;
export const PERSON_NAME_MAX = 80;

// Letters (incl. accented), spaces, apostrophes and hyphens — matches names
// like "María José O'Higgins-Ruiz" while rejecting stray punctuation/markup.
const NAME_PATTERN = /^[\p{L}\p{M}\s.'-]+$/u;

export type PersonNameValidation =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function validatePersonName(raw: string): PersonNameValidation {
  const value = raw.trim();

  if (value.length < PERSON_NAME_MIN) {
    return {
      ok: false,
      error: `El nombre debe tener al menos ${PERSON_NAME_MIN} caracteres.`,
    };
  }
  if (value.length > PERSON_NAME_MAX) {
    return {
      ok: false,
      error: `El nombre no puede superar ${PERSON_NAME_MAX} caracteres.`,
    };
  }
  if (!NAME_PATTERN.test(value)) {
    return {
      ok: false,
      error: "El nombre solo puede contener letras, espacios, apóstrofes y guiones.",
    };
  }

  return { ok: true, value };
}
