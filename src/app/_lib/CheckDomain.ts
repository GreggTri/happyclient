'use server'

export async function isBaseDomain(host: string | null): Promise<boolean> {
    const baseDomain = process.env.BASE_DOMAIN;

    return host === baseDomain;
  }
  