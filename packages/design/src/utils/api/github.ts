import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getGithubRepos(slug?: string) {
  return useQuery({
    queryKey: ["github", slug, "repo"],
    queryFn: async () => {
      return (
        await axios.get(
          "https://api.github.com/users/ardapaydin/repos?sort=stars&per_page=5",
          { headers: { Authorization: undefined } }
        )
      ).data as {
        id: number;
        full_name: string;
        name: string;
        html_url: string;
        stargazers_count: number;
        description: string;
      }[];
    },
    enabled: !!slug,
  });
}
