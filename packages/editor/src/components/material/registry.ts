/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 13:34:38
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 18:07:39
 */

import React from 'react';

export interface Component {
  label: string;
  key: string;
  uuid?: string;
  preview: () => React.ReactNode;
  render: (props?: any) => React.ReactNode;
}

const components: Array<Component> = [];
const componentMap: Record<Component['label'], Component> = {};

function register(component: Component) {
  components.push(component);
  componentMap[component.label] = component;
}

export { register, componentMap, components };
