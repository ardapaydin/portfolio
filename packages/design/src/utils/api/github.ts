import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getGithubRepos(
  slug?: string,
  sort: string = "stars",
  per_page: number = 5
) {
  return useQuery({
    queryKey: ["github", slug, "repo", sort, per_page],
    queryFn: async () => {
      return (
        await axios.get(
          "https://api.github.com/users/" +
            slug +
            "/repos?sort=" +
            sort +
            "&per_page=" +
            per_page,
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

export function getGitHubReadme(slug?: string, branch?: string) {
  return useQuery({
    queryKey: ["github", slug, "repos", slug, branch, "readme"],
    queryFn: async () => {
      return await axios.get<string>(
        "https://raw.githubusercontent.com/" +
          slug +
          "/" +
          slug +
          "/" +
          branch +
          "/README.md",
        { headers: { Authorization: undefined } }
      );
    },
  });
}
