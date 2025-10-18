import APIRequest from "../APIRequest";
import { Domain } from "../types/Domains";

export default function createDomain(name: string) {
  return APIRequest<{
    result: Domain;
  }>(
    `/pages/projects/${process.env.CLOUDFLARE_PAGES_PROJECT_NAME}/domains`,
    "POST",
    {
      name,
    }
  );
}
