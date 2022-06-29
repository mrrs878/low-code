/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-28 13:51:27
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 11:55:46
 */

import React, { FC } from 'react';
import Export from '../export';
import Import from '../import';
import './index.less';

const Tool: FC = () => (
  <div className="editor-tool">
    <Import />
    <Export />
  </div>
);

export default Tool;
