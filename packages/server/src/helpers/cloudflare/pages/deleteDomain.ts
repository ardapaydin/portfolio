import APIRequest from "../APIRequest";

export default function deleteDomain(domain: string) {
  return APIRequest(
    `accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/${process.env.CLOUDFLARE_PAGES_PROJECT_NAME}/domains/${domain}`,
    "DELETE"
  );
}
