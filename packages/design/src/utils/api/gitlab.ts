import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getGitlabProjects(
  slug?: string,
  sort: string = "created_at",
  per_page: string = "5"
) {
  return useQuery({
    queryKey: ["gitlab", slug, "projects", sort, per_page],
    queryFn: async () => {
      return (
        await axios.get(
          "https://gitlab.com/api/v4/users/" +
            slug +
            "/projects?order_by=" +
            sort +
            "&per_page=" +
            per_page,
          { headers: { Authorization: undefined } }
        )
      ).data as {
        id: number;
        name: string;
        description: string;
        web_url: string;
        star_count: number;
      }[];
    },
    enabled: !!slug,
  });
}
