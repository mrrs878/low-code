/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 14:31:36
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 21:08:54
 */

import React, { useCallback, useRef } from 'react';
import { CanvasRef } from 'src/components/canvas';
import { Component } from 'src/components/material/registry';
import { uuid } from '../utils';

interface IProps {
  canvasRef: CanvasRef;
  onDrop: (component: Component) => void;
}

const useMaterialDrag = ({ canvasRef, onDrop: _onDrop }:IProps) => {
  const selectedComponent = useRef<Component>();

  const onDragover = (e: DragEvent | React.DragEvent<CanvasRef>) => {
    e.preventDefault();
  };

  const onDragenter = (e: DragEvent | React.DragEvent<CanvasRef>) => {
    console.log('[useMaterialDrag] onDragenter', e);
    e!.dataTransfer!.dropEffect = 'move';
  };

  const onDrop = useCallback((e: DragEvent | React.DragEvent<CanvasRef>) => {
    console.log('[useMaterialDrag] onDrop', e, selectedComponent.current);
    _onDrop({ ...selectedComponent.current!, uuid: uuid() });
  }, [_onDrop]);

  const onDragleave = (e: DragEvent | React.DragEvent<CanvasRef>) => {
    console.log('[useMaterialDrag] onDragleave', e);
    e!.dataTransfer!.dropEffect = 'none';
  };

  const onDragstart = (e: React.DragEvent<HTMLDivElement>, component: Component) => {
    console.log('[useMaterialDrag] onDragstart', e);

    canvasRef.current?.addEventListener('dragover', onDragover);
    canvasRef.current?.addEventListener('dragenter', onDragenter);
    canvasRef.current?.addEventListener('dragleave', onDragleave);
    canvasRef.current?.addEventListener('drop', onDrop);
    selectedComponent.current = component;
  };

  const onDragend = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('[useMaterialDrag] onDragend', e);

    canvasRef.current?.removeEventListener('dragover', onDragover);
    canvasRef.current?.removeEventListener('dragenter', onDragenter);
    canvasRef.current?.removeEventListener('dragleave', onDragleave);
    canvasRef.current?.removeEventListener('drop', onDrop);
  };

  return [onDragstart, onDragend] as const;
};

export default useMaterialDrag;
