/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-07-10 09:35:24
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-10 09:37:45
 */

import { Grid } from 'Store/context';
import { THRESHOLD } from './enum';

type Point = {
  x: number;
  y: number;
};

type GapPos = {
  x: number, y1: number, y2: number, y: number, x1: number, x2: number, gapY: number, gapX: number,
};

const calculateRulePos = (grids: Array<Grid>, p: Grid) => {
  console.log('[calculateRuleItem] grids', grids);

  const res = {
    x: NaN, y: NaN, offsetY: 0, offsetX: 0,
  };

  if (grids.length === 1) {
    return res;
  }

  for (let index = 0; index < grids.length; index += 1) {
    const element = grids[index];
    if (Number.isNaN(res.y)) {
      // top - top
      if (Math.abs(p.y! - element.y!) < THRESHOLD) {
        res.y = element.y!;
      }
      // top - bottom
      if (Math.abs(p.y! - (element.y! + element.h)) < THRESHOLD) {
        res.y = element.y! + element.h;
      }
      // center - center
      if (Math.abs((p.y! + p.h! / 2) - (element.y! + element.h / 2)) < THRESHOLD) {
        res.y = element.y! + element.h / 2;
        res.offsetY = -p.h / 2;
      }
      // bottom - top
      if (Math.abs((p.y! + p.h) - element.y!) < THRESHOLD) {
        res.y = element.y!;
        res.offsetY = -p.h;
      }
      // bottom - bottom
      if (Math.abs((p.y! + p.h) - (element.y! + element.h)) < THRESHOLD) {
        res.y = res.y!;
      }
    }

    if (Number.isNaN(res.x)) {
      if (Math.abs(p.x! - element.x!) < THRESHOLD) {
        res.x = element.x!;
      }
      if (Math.abs(p.x! - (element.x! + element.w)) < THRESHOLD) {
        res.x = element.x! + element.w;
      }
      if (Math.abs((p.x! + p.w! / 2) - (element.x! + element.w / 2)) < THRESHOLD) {
        res.x = element.x! + element.w / 2;
        res.offsetX = -p.w / 2;
      }
      if (Math.abs((p.x! + p.w) - element.x!) < THRESHOLD) {
        res.x = element.x!;
        res.offsetX = -p.w;
      }
      if (Math.abs((p.x! + p.w) - (element.x! + element.w)) < THRESHOLD) {
        res.x = element.x! + element.w;
        res.offsetX = -p.w;
      }
    }
  }
  return res;
};

const calculateRuleGap = (grids: Array<Grid>, p: Grid) => {
  const res = {
    x: NaN, y1: NaN, y2: NaN, y: NaN, x1: NaN, x2: NaN, gapY: 0, gapX: 0,
  };
  if (grids.length <= 1) {
    return res;
  }
  let tmp = grids.sort((a, b) => (a.y! > b.y! ? 1 : -1)).slice(-2);
  let [p1, p2] = tmp;
  let gap = p2.y! - (p1.y! + p1.h);
  const y = (p2.y! + p2.h!) + gap;

  if (Math.abs(y - p.y!) < THRESHOLD) {
    res.x = p1.x!;
    res.y1 = p1.y! + p1.h;
    res.y2 = p2.y! + p2.h;
    res.gapY = gap;
  }

  tmp = grids.sort((a, b) => (a.x! > b.x! ? 1 : -1)).slice(-2);
  [p1, p2] = tmp;
  gap = p2.x! - (p1.x! + p1.w);
  const x = (p2.x! + p2.w!) + gap;

  console.log('[calculateRuleGap] p', grids, p2, p1);

  if (Math.abs(x - p.x!) < THRESHOLD) {
    res.y = p1.y!;
    res.x1 = p1.x! + p1.w;
    res.x2 = p2.x! + p2.w;
    res.gapX = gap;
  }
  return res;
};

export {
  Point, GapPos, calculateRulePos, calculateRuleGap,
};
