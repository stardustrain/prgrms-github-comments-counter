import { ld } from "https://x.nest.land/lodash@0.1.0/mod.ts";
import {
  isBefore,
  isAfter,
  subWeeks,
  addDays,
  isValid
} from "https://deno.land/x/date_fns@v2.15.0/index.js";

import { START_AT, END_AT } from './env.ts'

import type { CommentNode } from "./model.d.ts";

const STUDY_READERS = ["rotoshine", "brightparagon", "stardustrain"];

const checkValidDate = (date: string) => isValid(new Date(date))

const getDateRange = () => {
  if (checkValidDate(START_AT) && checkValidDate(END_AT)) {
    return {
      startAt: new Date(START_AT),
      endAt: new Date(END_AT),
    }
  }

  const today = new Date()
  return {
    startAt: subWeeks(today, 1),
    endAt: addDays(today, 1)
  }
}

export const isStudyMember = (comment: CommentNode) =>
  !ld.includes(STUDY_READERS, comment.author.login, 0, undefined);

export const isCreatedInStudyWeek = (comment: CommentNode) => {
  const { startAt, endAt } = getDateRange()
  const createdAt = new Date(comment.createdAt);

  return isAfter(createdAt, (startAt)) && isBefore(createdAt, (endAt));
};

export const isEnoughCommentLength = (comment: CommentNode) =>
  comment.bodyText.replace(/\s/g, "").length > 5;
