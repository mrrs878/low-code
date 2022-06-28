/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-28 13:51:27
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-28 21:39:43
 */

import React, { FC } from 'react';
import Export from '../export';
import Import from '../import';
import './index.less';

interface IProps {
  original: string;
  modified: string;
}

const Tool: FC<IProps> = ({
  original,
  modified,
}) => (
  <div className="editor-tool">
    <Import />
    <Export
      original={original}
      modified={modified}
    />
  </div>
);

export default Tool;
