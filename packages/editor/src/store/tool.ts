/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-29 14:33:18
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 20:33:09
 */

import { Component } from 'Components/material/registry';
import { Layout } from 'react-grid-layout';
import { Grid, Schema } from './context';

const DEFAULT_LAYOUT: Layout = {
  x: 1,
  y: Infinity,
  w: 1,
  h: 1,
  i: Date.now().toString(),
};

export function assignGridFromLayout(layout: Layout, i: Grid['i']): Grid {
  return {
    x: layout.x,
    y: layout.y,
    w: layout.w,
    h: layout.h,
    i,
  };
}

export function assignSchemaFromComponent(c: Component, l = DEFAULT_LAYOUT): Schema[0] {
  return {
    type: c.key,
    uuid: c.uuid!,
    props: c.propsMap,
    xProps: c.xProps,
    grid: assignGridFromLayout(l, c.uuid!),
  };
}
