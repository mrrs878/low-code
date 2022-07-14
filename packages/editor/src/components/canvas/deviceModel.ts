/*
* @Author: mrrs878@foxmail.com
* @Date: 2022-07-13 10:56:59
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-14 21:44:26
*/

import { Grid } from 'Store/context';
import { THRESHOLD } from './enum';

export type ShapeDistance = { magnetX: number, magnetY: number };

const closestZero = (nums: Array<number>) => nums.reduce((acc, num) => {
  if (Math.abs(num) < Math.abs(acc)) {
    // eslint-disable-next-line no-param-reassign
    acc = num;
  }
  return acc;
}, Number.MAX_SAFE_INTEGER);

const getShape = (g: Grid) => ({
  top: g.y!, bottom: g.y! + g.h, left: g.x!, right: g.x! + g.w,
});

export const getShapeDistance = (devices: Array<Grid>, nowDevice: Grid) => {
  const nowDeviceShape = getShape(nowDevice);
  const rulePosition = { x: NaN, y: NaN };

  const shapeDistance = devices
    .reduce(
      (acc, d) => {
        const shape = getShape(d);
        const topToTop = shape.top - nowDeviceShape.top;
        const bottomToBottom = shape.bottom - nowDeviceShape.bottom;
        const leftToLeft = shape.left - nowDeviceShape.left;
        const rightToRight = shape.right - nowDeviceShape.right;
        const topToBottom = shape.top - nowDeviceShape.bottom;
        const bottomToTop = shape.bottom - nowDeviceShape.top;
        const leftToRight = shape.left - nowDeviceShape.right;
        const rightToLeft = shape.right - nowDeviceShape.left;
        const magnetY = closestZero([
          topToTop,
          bottomToBottom,
          topToBottom,
          bottomToTop,
        ]);
        const magnetX = closestZero([
          leftToLeft,
          leftToRight,
          rightToLeft,
          rightToRight,
        ]);
        if (Math.abs(magnetX) < Math.abs(acc.magnetX)) {
          acc.magnetX = magnetX;
        }
        if (Math.abs(magnetY) < Math.abs(acc.magnetY)) {
          acc.magnetY = magnetY;
        }

        if (Math.abs(leftToLeft) < THRESHOLD || Math.abs(leftToRight) < THRESHOLD) {
          rulePosition.x = shape.left;
        }
        if (Math.abs(rightToRight) < THRESHOLD || Math.abs(rightToLeft) < THRESHOLD) {
          rulePosition.x = shape.right;
        }

        if (Math.abs(topToTop) < THRESHOLD || Math.abs(topToBottom) < THRESHOLD) {
          rulePosition.y = shape.top;
        }
        if (Math.abs(bottomToBottom) < THRESHOLD || Math.abs(bottomToTop) < THRESHOLD) {
          rulePosition.y = shape.bottom;
        }

        return acc;
      },
      { magnetX: Number.MAX_SAFE_INTEGER, magnetY: Number.MAX_SAFE_INTEGER },
    );
  return { shapeDistance, rulePosition };
};

export const getLockPosition = (shapeDistance: ShapeDistance, currentPos: Grid) => {
  const res = {
    lockX: NaN,
    lockY: NaN,
  };
  if (Math.abs(shapeDistance.magnetX) < THRESHOLD) {
    res.lockX = currentPos.x! + shapeDistance.magnetX;
  }
  if (Math.abs(shapeDistance.magnetY) < THRESHOLD) {
    res.lockY = currentPos.y! + shapeDistance.magnetY;
  }

  return res;
};
