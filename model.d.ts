export type Maybe<T> = T | null;

export type Author = {
  login: string;
};

export type CommentNode = {
  author: Author;
  createdAt: string;
  bodyText: string;
};

export type Comments = {
  nodes: CommentNode[];
};

export type ReviewThreads = {
  nodes: {
    comments: Comments;
  }[];
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor: Maybe<string>;
};

export type PullRequestNode = {
  comments: Comments;
  reviewThreads: ReviewThreads;
};

export type PullRequests = {
  pageInfo: PageInfo;
  nodes: PullRequestNode[];
};

export type Repository = {
  repository: { pullRequests: PullRequests };
};
