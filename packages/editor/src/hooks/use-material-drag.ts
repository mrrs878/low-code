/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 14:31:36
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-30 21:46:14
 */

import React, { useRef } from 'react';
import { Component } from 'src/components/material/registry';

const useMaterialDrag = () => {
  const dragComponentRef = useRef<Component | null>(null);

  const onDragstart = (e: React.DragEvent<HTMLDivElement>, component: Component) => {
    console.log('[useMaterialDrag] onDragstart', e);

    // eslint-disable-next-line no-param-reassign
    dragComponentRef.current = component;
  };

  const onDragend = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('[useMaterialDrag] onDragend', e);
  };

  return [dragComponentRef, onDragstart, onDragend] as const;
};

export default useMaterialDrag;
