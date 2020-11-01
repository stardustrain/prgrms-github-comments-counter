import type { Maybe, PullRequestNode, Repository } from "./model.d.ts";

const query = `
query CommentsCount($after: String) {
  repository(owner: "odkmedia", name: "odc-frontend") {
    pullRequests(first: 20, orderBy: { field: CREATED_AT, direction: DESC }, states: OPEN, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        comments(first: 50) {
          nodes {
            author {
              login
            }
            createdAt
            bodyText
          }
        }
        reviewThreads(first: 50) {
          nodes {
            comments(first: 50) {
              nodes {
                author {
                  login
                }
                createdAt
                bodyText
              }
            }
          }
        }
      }
    }
  }
}
`;

const fetchGithubData = async (after?: Maybe<string>) => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        after,
      },
    }),
  });

  const result: { data: Repository } = await response.json();

  return result.data.repository.pullRequests;
};

export const mergingGithubData = async () => {
  const run = async (
    data: PullRequestNode[],
    after?: Maybe<string>
  ): Promise<PullRequestNode[]> => {
    const { pageInfo, nodes } = await fetchGithubData(after);
    const mergedData = data.concat(nodes);
    if (!pageInfo.hasNextPage) {
      return mergedData;
    }
    return await run(mergedData, pageInfo.endCursor);
  };

  return await run([]);
};
