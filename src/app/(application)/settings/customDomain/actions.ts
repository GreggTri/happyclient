"use server"

import { verifySession } from "@/app/_lib/session";
import { revalidatePath } from "next/cache";
import fetch from 'node-fetch';

//const subdomainRegex = /^[a-zA-Z0-9-]+$/;

const VERCEL_API_URL = 'https://api.vercel.com';
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;

// Function to add a domain (either a subdomain of your main domain or an entire custom domain)
export async function addDomain(subdomain: string, domain?: string) {
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return new Error("Unauthorized");
    
    try {
        let fullDomain = '';

        const baseDomain = process.env.BASE_DOMAIN

        // Scenario 1: Subdomain of your main domain (e.g., subdomain.gethappyclient.com)
        if (!domain) {
        fullDomain = `${subdomain}.${baseDomain}`;
        } 
        // Scenario 2: Custom domain with subdomain (e.g., subdomain.customerdomain.com)
        else if (domain && subdomain) {
        fullDomain = `${subdomain}.${domain}`;
        } 
        // Scenario 3: Custom domain without subdomain (e.g., customerdomain.com)
        else if (domain && !subdomain) {
        fullDomain = domain;
        }

        // Call the Vercel API to add the domain (subdomain or custom domain)
        const response = await fetch(`${VERCEL_API_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: fullDomain, 
        }),
        });

        const result = await response.json();

        if (!response.ok) {
        throw new Error(`Failed to add domain: `);
        }

        return result;
    } catch (error) {
        console.error('Error adding domain:', error);
        throw error;
    }
}

  