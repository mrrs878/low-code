/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-07-10 09:39:20
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-10 09:58:49
 */

import React, { FC } from 'react';
import { BORDER_WIDTH } from '../enum';
import { Point } from '../tool';

interface IProps {
  pos: Point;
}

const Rule: FC<IProps> = ({
  pos,
}) => (
  <div>
    {
        !Number.isNaN(pos.y) && (
          <div
            className="rule rule-gap rule-y"
            style={{
              left: 0,
              right: 0,
              top: pos.y + BORDER_WIDTH,
            }}
          />
        )
      }
    {
        !Number.isNaN(pos.x) && (
          <div
            className="rule rule-x"
            style={{
              top: 0,
              bottom: 0,
              left: pos.x + BORDER_WIDTH,
            }}
          />
        )
      }
  </div>
);

export default Rule;
