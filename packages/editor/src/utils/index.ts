/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 18:11:13
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-13 11:51:46
 */

import { clone } from 'ramda';
import { Component, componentMap } from 'Components/material/registry';
import { Schema } from 'Store/context';

/**
 * 快速生成uuid
 * @returns uuid
 */
// eslint-disable-next-line import/prefer-default-export
export function uuid() {
  const url = URL.createObjectURL(new Blob());
  const res = url.toString();
  URL.revokeObjectURL(url);
  return res.substr(res.lastIndexOf('/') + 1);
}

/**
 * props转propsMap
 * @param props props
 * @returns propsMap
 */
export function props2propsMap(props: Component['props']): Component['propsMap'] {
  return props?.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value || cur.default }), {});
}

export function schema2components(schema: Schema) {
  return schema.map((item) => ({
    ...clone(componentMap[item.type]),
    ...item,
    grid: { ...item.grid, lockX: NaN, lockY: NaN },
    propsMap: item.props || props2propsMap(componentMap[item.type].props),
  }));
}
