/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 20:50:14
 */

import React, {
  FC, MutableRefObject, useContext, useRef,
} from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { DispatchContext, StateContext } from 'Store/context';
import 'react-grid-layout/css/styles.css';
import { Component } from 'Components/material/registry';
import { schema2components } from 'Utils/index';
import { GRID } from 'Config/index';
import './index.less';

export type CanvasRef = MutableRefObject<HTMLDivElement | null>;

interface IProps {
  dragComponentRef: MutableRefObject<Component | null>;
  onSelect: (component?: Component['uuid']) => void;
  selectedComponent: Component['uuid'];
}

const Canvas: FC<IProps> = ({
  dragComponentRef,
  onSelect,
  selectedComponent,
}) => {
  const { modifiedSchema } = useContext(StateContext);
  const { addComponent, dragComponent } = useContext(DispatchContext);

  const components = schema2components(modifiedSchema);

  const canvas = useRef<HTMLDivElement | null>(null);

  console.log('[Canvas] render schema', modifiedSchema, components);
  return (
    <div
      className="editor-canvas"
      onDragEnter={(e) => {
        console.log('[onDrop]', e.clientX, e.clientY);
        e.dataTransfer.dropEffect = 'move';
      }}
      ref={canvas}
      role="presentation"
      onClick={() => { onSelect(); }}
      onDragOver={debounce((e) => {
        console.log('[onDrop onDragOver]', e, e.clientX - (canvas.current?.offsetLeft || 0));
        const x = e.clientX - (canvas.current?.offsetLeft || 0);
        const y = e.clientY - (canvas.current?.offsetTop || 0);

        const { grid } = dragComponentRef.current!;

        const u = addComponent(dragComponentRef.current!, {
          x, y, w: grid?.w, h: grid?.h,
        });

        onSelect(u);
      }, 100)}
    >
      {
        components.map((component, index) => (
          <Draggable
            grid={GRID}
            bounds=".editor-canvas"
            position={{ x: modifiedSchema[index].grid.x!, y: modifiedSchema[index].grid.y! }}
            offsetParent={document.querySelector<HTMLDivElement>('.editor-canvas') || undefined}
            onDrag={throttle((_, data) => {
              const { x, y } = data;
              dragComponent(component.uuid, {
                x, y,
              });
            })}
          >
            <div
              className={classNames('editor-canvas-item', { active: selectedComponent === component.uuid })}
              key={modifiedSchema[index].uuid}
              data-grid={{
                ...modifiedSchema[index].grid,
                isBounded: true,
                isResizable: component.resizable ?? true,
              }}
              role="presentation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Canvas] onClick', component, modifiedSchema[index]);
                if (selectedComponent === component.uuid) {
                  onSelect();
                  return;
                }
                onSelect(component.uuid);
              }}
            >
              <div
                className="editor-canvas-item__mask"
                style={{
                  width: component.resizable ? modifiedSchema[index].grid.w : 'unset',
                  height: component.resizable ? modifiedSchema[index].grid.h : 'unset',
                }}
              >
                {component.render(component.propsMap)}
              </div>
            </div>
          </Draggable>
        ))
      }
    </div>
  );
};

export default Canvas;
