/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-29 14:33:18
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 19:26:03
 */

import { Component } from 'Components/material/registry';
import { Grid, Schema } from './context';

const DEFAULT_LAYOUT: Grid = {
  x: 1,
  y: Infinity,
  w: 75,
  h: 32,
};

export function assignSchemaFromComponent(c: Component, l = DEFAULT_LAYOUT): Schema[0] {
  return {
    type: c.key,
    uuid: c.uuid!,
    props: c.propsMap,
    xProps: c.xProps,
    grid: l,
  };
}
