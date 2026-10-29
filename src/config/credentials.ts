export type CredentialItem = {
  name: string;
  logo?: string;
  description?: string;
  link?: string;
};

/**
 * Add official client logos or credential badges here.
 * If left empty ([]), the credential strip is completely hidden from the page.
 */
export const credentials: CredentialItem[] = [];
