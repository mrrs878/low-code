/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-28 13:51:27
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 11:00:24
 */

import { Space } from 'antd';
import React, { FC } from 'react';
import Export from './export';
import Import from './import';
import './index.less';
import Preview from './preview';

const Tool: FC = () => (
  <Space className="editor-tool">
    <Preview />
    <Import />
    <Export />
  </Space>
);

export default Tool;
