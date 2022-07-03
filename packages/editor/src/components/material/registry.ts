/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 13:34:38
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 17:58:58
 */

import React from 'react';

export type ComponentOption = {
  value: string;
  label: string;
  xProps?: any;
} | string;

export type ComponentProp<T, P extends keyof T> = {
  name: P;
  description: string,
  type: T[P],
  value?: T[P],
  options?: Array<ComponentOption>;
  default: T[P],
  required: boolean;
};

export interface Component<T = any> {
  label: string;
  key: string;
  uuid?: string;
  preview: () => React.ReactNode;
  render: (props?: T) => React.ReactNode;
  props?: Array<ComponentProp<T, keyof T>>;
  xProps?: any;
  propsMap?: { [key: string]: any };
  resizable?: boolean;
}

const components: Array<Component> = [];
const componentMap: Record<Component['label'], Component> = {};

function register<T>(component: Component<T>) {
  components.push(component);
  componentMap[component.key] = component;
}

export { register, componentMap, components };
