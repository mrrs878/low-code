/*
* @Author: mrrs878@foxmail.com
* @Date: 2022-07-03 11:54:48
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 17:19:30
*/

/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Button, message } from 'antd';
import { omit } from 'ramda';
import { MessageInstance } from 'antd/lib/message';

interface IProps {
  props: Record<string, any>;
  xProps: Record<string, any>;
}

const render = (config: IProps) => {
  const { props = {}, xProps = {} } = config;
  const { onClick } = props;
  let Content;

  const btnProps = omit(['onClick'], props);

  switch (onClick) {
    case 'message': {
      const { onClick: onClickProps } = xProps;
      Content = (
        <Button
          {...btnProps}
          onClick={() => message[onClickProps.type as keyof MessageInstance || 'info'](onClickProps)}
        >
          {btnProps.value}
        </Button>
      );
      break;
    }
    default:
      Content = (
        <Button {...btnProps}>
          {btnProps.value}
        </Button>
      );
      break;
  }

  return Content;
};

export default render;
