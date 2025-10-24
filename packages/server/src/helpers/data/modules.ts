export const Module = {
  GithubRepositories: 1,
};

export default [
  {
    id: Module.GithubRepositories,
    name: "GitHub Repositories",
    require: "oauth:github",
  },
];
