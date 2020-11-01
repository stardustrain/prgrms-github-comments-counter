import { ld } from "https://x.nest.land/lodash@0.1.0/mod.ts";
import {
  isBefore,
  isAfter,
} from "https://deno.land/x/date_fns@v2.15.0/index.js";

import { CommentNode } from "./model.d.ts";

const STUDY_READERS = ["rotoshine", "brightparagon", "stardustrain"];

export const isStudyMember = (comment: CommentNode) =>
  !ld.includes(STUDY_READERS, comment.author.login, 0, undefined);

export const isCreatedInStudyWeek = (comment: CommentNode) => {
  const startAt = new Date("2020-10-26");
  const endAt = new Date("2020-10-30");
  const createdAt = new Date(comment.createdAt);
  return isAfter(createdAt, startAt) && isBefore(createdAt, endAt);
};

export const isEnoughCommentLength = (comment: CommentNode) =>
  comment.bodyText.replace(/\s/g, "").length > 5;
