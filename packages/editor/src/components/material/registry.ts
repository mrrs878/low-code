/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 13:34:38
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 23:25:35
 */

import React from 'react';

export type ComponentProp<T, P extends keyof T> = {
  name: P;
  description: string,
  type: T[P],
  value?: T[P],
  default: T[P],
};

export interface Component<T = any> {
  label: string;
  key: string;
  uuid?: string;
  preview: () => React.ReactNode;
  render: (props?: T) => React.ReactNode;
  props?: Array<ComponentProp<T, keyof T>>;
  propsMap?: { [key: string]: any };
}

const components: Array<Component> = [];
const componentMap: Record<Component['label'], Component> = {};

function register<T>(component: Component<T>) {
  components.push(component);
  componentMap[component.key] = component;
}

export { register, componentMap, components };
