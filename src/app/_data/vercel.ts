'use server'
import 'server-only'

import fetch from 'node-fetch';
import { cache } from 'react';

const VERCEL_API_URL = 'https://api.vercel.com';
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TOKEN = process.env.VERCEL_HP_API_KEY;

export async function addDomainToVercel(domain: string) {
  const response = await fetch(`${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: domain }),
  });

  const data = await response.json();

  console.log(data);

  if (!response.ok) {
    console.log("response not okay but made it past data");
    throw new Error(data.error.message);
  }

  return {
    'name': data!.name,
    'apexName': data!.apexName,
    'verified': data!.verified,
    'verification': data!.verification
  };
}


export const getDomainFromVercel = cache(async(domain: string) => {
    const response = await fetch(`${VERCEL_API_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
        console.log("response not okay but made it past data");
        throw new Error(data.error.message);
    }

    if (data!.verified === false) {
        return data?.verification;
    } else if(data!.verified == true) {
      return null; //don't need to do anything
    }

    throw new Error("Vercel did not give verification status")
})

export async function verifyDomainOnVercel(domain: string) {
  const url = `${VERCEL_API_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Unknown error during domain verification.');
  }

  return data;
}