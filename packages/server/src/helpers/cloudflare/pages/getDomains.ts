import APIRequest from "../APIRequest";
import { Domain } from "../types/Domains";

export default function getDomains() {
  return APIRequest<{
    result: Domain[];
  }>(
    `accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/${process.env.CLOUDFLARE_PAGES_PROJECT_NAME}/domains`,
    "GET"
  );
}
