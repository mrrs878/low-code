/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-13 10:51:13
 */

import React, {
  FC, memo, MutableRefObject, useContext, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { DraggableCore } from 'react-draggable';
import debounce from 'lodash.debounce';
import { clone } from 'ramda';
import {
  DispatchContext, StateContext,
} from 'Store/context';
import { Component } from 'Components/material/registry';
import { schema2components } from 'Utils/index';
import Rule from './components/Rule';
import Gap from './components/Gap';
import {
  Point, GapPos,
} from './tool';
import './index.less';

const MRule = memo(Rule);
const MGap = memo(Gap);

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

  const [rulePos] = useState<Point>({ x: NaN, y: NaN });
  const [gapPos] = useState<GapPos>({ x: NaN, y: NaN } as any);

  const [components, setComponents] = useState(() => schema2components(modifiedSchema));

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
      onClick={() => {
        onSelect();
      }}
      onDragOver={debounce((e) => {
        console.log('[onDrop onDragOver]', e, e.clientX - (canvas.current?.offsetLeft || 0));
        const x = e.clientX - (canvas.current?.offsetLeft || 0);
        const y = e.clientY - (canvas.current?.offsetTop || 0);

        const { grid } = dragComponentRef.current!;

        const u = addComponent(dragComponentRef.current!, {
          x, y, w: grid.w, h: grid.h,
        });

        onSelect(u);
      }, 100)}
    >
      {
        components.map((component, index) => (
          <DraggableCore
            key={component.uuid}
            onDrag={(_, data) => {
              setComponents((prev) => {
                const tmp = clone(prev);
                tmp[index].grid.x = component.grid.x! + data.deltaX;
                tmp[index].grid.y = component.grid.y! + data.deltaY;
                return tmp;
              });
            }}
            onStop={() => {
              dragComponent(component.uuid, component.grid);
            }}
          >
            <div
              className={classNames('editor-canvas-item', {
                active: selectedComponent === component.uuid,
              })}
              style={{
                transform: `translate(${component.grid.x}px, ${component.grid.y}px)`,
              }}
              key={component.uuid}
              role="presentation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Canvas] onClick', component);
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
                  width: component.resizable ? component.grid.w : 'unset',
                  height: component.resizable ? component.grid.h : 'unset',
                }}
              >
                {component.render(component.propsMap)}
              </div>
            </div>
          </DraggableCore>
        ))
      }
      <MRule pos={rulePos} />
      <MGap pos={gapPos} />
    </div>
  );
};

export default Canvas;
