export function phoneRegex(value: string) {
  return /[a-zA-Z]/.test(value);
}

export const numberRegex = (value: string) => /^[0-9]*\.?[0-9]*$/.test(value);