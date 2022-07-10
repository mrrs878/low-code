/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 13:34:38
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-10 09:25:42
 */

import React from 'react';
import { Grid } from 'Store/context';

export type ComponentOption = {
  value: string;
  label: string;
  xProps?: Array<ComponentProp<any, any>>;
} | string;

export type ComponentProp<T, P extends keyof T> = {
  name: P;
  description: string,
  type: PropType,
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
  resizable?: 'w' | 'h' | 'size' | 'none';
  grid: Grid;
}

export type PropType = 'String' | 'Number' | 'Array' | 'Boolean';

const components: Array<Component> = [];
const componentMap: Record<Component['label'], Component> = {};

function register<T>(component: Component<T>) {
  components.push(component);
  componentMap[component.key] = component;
}

function defineProps<T>(type: PropType, props: Omit<ComponentProp<T, keyof T>, 'type'>): ComponentProp<T, keyof T> {
  return {
    ...props,
    type,
  };
}

export {
  register, defineProps, componentMap, components,
};
