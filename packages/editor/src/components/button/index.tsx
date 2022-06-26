/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 16:54:31
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 16:57:42
 */

import React from 'react';
import { Button } from 'antd';

const MButton = ({ children, className = '', ...rest }: any) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Button className={`m-button${className ? ` ${className}` : ''}`} {...rest}>{children}</Button>
);

export default MButton;
