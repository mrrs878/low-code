/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-13 20:04:50
 */

import React, {
  FC, memo, MutableRefObject, useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { DraggableCore } from 'react-draggable';
import debounce from 'lodash.debounce';
import { clone, remove } from 'ramda';
import {
  DispatchContext, Grid, StateContext,
} from 'Store/context';
import { Component } from 'Components/material/registry';
import { schema2components } from 'Utils/index';
import Rule from './components/Rule';
import Gap from './components/Gap';
import { getLockPosition, getShapeDistance } from './deviceModel';
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

const getEffectivePosition = (grid: Grid & { lockX: number; lockY: number }) => ({
  x: Number.isNaN(grid.lockX) ? grid.x : grid.lockX,
  y: Number.isNaN(grid.lockY) ? grid.y : grid.lockY,
});

const Canvas: FC<IProps> = ({
  dragComponentRef,
  onSelect,
  selectedComponent,
}) => {
  const { modifiedSchema } = useContext(StateContext);
  const { addComponent, dragComponent } = useContext(DispatchContext);

  const [rulePos, setRulePos] = useState<Point>({ x: NaN, y: NaN });
  const [gapPos] = useState<GapPos>({ x: NaN, y: NaN } as any);

  const [components, setComponents] = useState(() => schema2components(modifiedSchema));

  const canvas = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setComponents(schema2components(modifiedSchema));
  }, [modifiedSchema]);

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
              const grids = remove(index, 1, components).map(({ grid }) => grid);
              const { shapeDistance, rulePosition } = getShapeDistance(grids, component.grid);
              console.log('[onDrag]', components);

              const res = getLockPosition(shapeDistance, component.grid);
              setComponents((prev) => {
                console.log('[onDrag] shapeDistance', shapeDistance, res);
                const tmp = clone(prev);
                tmp[index].grid.lockX = res.lockX;
                tmp[index].grid.lockY = res.lockY;
                tmp[index].grid.x = component.grid.x! + data.deltaX;
                tmp[index].grid.y = component.grid.y! + data.deltaY;
                return tmp;
              });

              setRulePos(rulePosition);
            }}
            onStop={() => {
              const pos = getEffectivePosition(component.grid);
              console.log('[onStop]', component.grid, pos);
              dragComponent(component.uuid, pos);
            }}
          >
            <div
              className={classNames('editor-canvas-item', {
                active: selectedComponent === component.uuid,
              })}
              style={{
                transform: `translate(
                  ${Number.isNaN(component.grid.lockX) ? component.grid.x : component.grid.lockX}px,
                  ${Number.isNaN(component.grid.lockY) ? component.grid.y : component.grid.lockY}px
                )`,
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
