import { ld } from "https://x.nest.land/lodash@0.1.0/mod.ts";

import { mergingGithubData } from "./api.ts";
import {
  isStudyMember,
  isCreatedInStudyWeek,
  isEnoughCommentLength,
} from "./utils.ts";
import { VIEW_MODE } from "./env.ts";

import type { CommentNode, PullRequestNode } from "./model.d.ts";

const rawView = VIEW_MODE; // raw

try {
  const prs = await mergingGithubData();

  const getFilterdComments = (prs: PullRequestNode[]) =>
    prs
      .flatMap((pr) =>
        pr.reviewThreads.nodes
          .flatMap((reviewThread) => reviewThread.comments.nodes)
          .concat(pr.comments.nodes)
          .map((comment) => Object.assign(comment, { title: pr.title }))
      )
      .filter(isStudyMember)
      .filter(isCreatedInStudyWeek)
      .filter(isEnoughCommentLength);

  type FilteredComments = ReturnType<typeof getFilterdComments>;

  const commentsGroupByAuthor: [string, CommentNode[]] = ld.toPairs(
    ld.groupBy(
      getFilterdComments(prs),
      (comment: FilteredComments[number]) => comment.author.login
    )
  );

  const res = ld
    .map(
      commentsGroupByAuthor,
      ([author, comments]: [string, CommentNode[]]) => [
        author,
        comments,
        comments.length,
      ]
    )
    .sort(
      (
        prev: [string, CommentNode[], number],
        next: [string, CommentNode[], number]
      ) => {
        return ld.last(next) - ld.last(prev);
      }
    );

  if (rawView === "raw") {
    console.log(res);
  }

  if (ld.isNil(rawView)) {
    console.log(
      ld
        .take(res, 3, null)
        .map(
          (sortedComment: [string, CommentNode[], number]) =>
            `${ld.first(sortedComment)}: total ${ld.last(
              sortedComment
            )} comments.`
        )
        .join("\n")
    );
  }
} catch (e) {
  console.error(e);
}
