/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-07-10 09:45:59
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-10 09:59:14
 */

import React, { FC } from 'react';
import { BORDER_WIDTH } from '../enum';
import { GapPos } from '../tool';

interface IProps {
  pos: GapPos;
}

const Gap: FC<IProps> = ({
  pos,
}) => {
  console.log('[rerender] Gap');
  return (
    <div>
      {
          !Number.isNaN(pos.x) && (
          <>
            <div
              className="rule rule-gap-y"
              style={{
                top: pos.y1 + BORDER_WIDTH,
                height: pos.gapY,
                lineHeight: `${pos.gapY}px`,
                left: pos.x + 15,
              }}
            >
              <div className="rule-pos">
                &nbsp;
                {pos.gapY}
              </div>
            </div>
            <div
              className="rule rule-gap-y"
              style={{
                top: pos.y2 + BORDER_WIDTH,
                height: pos.gapY,
                lineHeight: `${pos.gapY}px`,
                left: pos.x + 15,
              }}
            >
              <div className="rule-pos">
                &nbsp;
                {pos.gapY}
              </div>
            </div>
          </>
          )
        }
      {
          !Number.isNaN(pos.y) && (
          <>
            <div
              className="rule rule-gap-x"
              style={{
                left: pos.x1 + BORDER_WIDTH,
                width: pos.gapX,
                top: pos.y + BORDER_WIDTH,
              }}
            >
              <div className="rule-pos">
                &nbsp;
                {pos.gapX}
              </div>
            </div>
            <div
              className="rule rule-gap-x"
              style={{
                left: pos.x2 + BORDER_WIDTH,
                width: pos.gapX,
                top: pos.y + BORDER_WIDTH,
              }}
            >
              <div className="rule-pos">
                &nbsp;
                {pos.gapX}
              </div>
            </div>
          </>
          )
        }
    </div>
  );
};

export default Gap;
