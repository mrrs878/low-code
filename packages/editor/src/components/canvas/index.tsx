/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-10 10:00:43
 */

import React, {
  FC, memo, MutableRefObject, useContext, useRef, useState,
} from 'react';
import classNames from 'classnames';
import Draggable, { DraggableData } from 'react-draggable';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { remove } from 'ramda';
import {
  DispatchContext, Grid, StateContext,
} from 'Store/context';
import { Component } from 'Components/material/registry';
import { schema2components } from 'Utils/index';
import Rule from './components/Rule';
import Gap from './components/Gap';
import {
  Point, GapPos, calculateRulePos, calculateRuleGap,
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

  const [rulePos, setRulePos] = useState<Point>({ x: NaN, y: NaN });
  const [gapPos, setGapPos] = useState<GapPos>({ x: NaN, y: NaN } as any);

  const components = schema2components(modifiedSchema);

  const canvas = useRef<HTMLDivElement | null>(null);

  const grids = modifiedSchema.map(({ grid }) => grid);

  const snipToRule = (data: DraggableData, points: Array<Grid>, p: Grid, uuid: Component['uuid']) => {
    let { x, y } = data;
    const { w, h } = p;
    const pos = calculateRulePos(points, {
      x, y, w, h,
    });
    console.log('[onDrag] ruleIndex', pos);
    if ((!Number.isNaN(pos.y) && pos.y !== rulePos.y)
      || (!Number.isNaN(pos.x) && pos.x !== rulePos.x)) {
      setRulePos(pos);
    }
    if (!Number.isNaN(pos.x)) {
      x = pos.x;
    }
    if (!Number.isNaN(pos.y)) {
      y = pos.y;
    }
    dragComponent(uuid, {
      x: x + pos.offsetX, y: y + pos.offsetY,
    });
  };

  const snipToGap = (data: DraggableData, points: Array<Grid>, p: Grid, uuid: Component['uuid']) => {
    let { x, y } = data;
    const { w, h } = p;
    const gap = calculateRuleGap(points, {
      x, y, w, h,
    });
    console.log('[onDrag] gap', points, gap);
    if ((!Number.isNaN(gap.y2) && gap.y2 !== gapPos.y2)
      || (!Number.isNaN(gap.x2) && gap.x2 !== gapPos.x2)) {
      setGapPos(gap);
    }
    if (!Number.isNaN(gap.y2)) {
      y = gap.y2 + gap.gapY;
    }
    if (!Number.isNaN(gap.x2)) {
      x = gap.x2 + gap.gapX;
    }
    dragComponent(uuid, {
      x, y,
    });
  };

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
          <Draggable
            key={component.uuid}
            bounds=".editor-canvas"
            position={{ x: modifiedSchema[index].grid.x!, y: modifiedSchema[index].grid.y! }}
            offsetParent={document.querySelector<HTMLDivElement>('.editor-canvas') || undefined}
            onDrag={throttle((_, data) => {
              const t = remove(index, 1, grids);
              const g = [...t, {
                x: 0, y: 0, w: canvas.current?.offsetWidth!, h: canvas.current?.offsetHeight!,
              }];
              snipToRule(data, g, modifiedSchema[index].grid, component.uuid);
              snipToGap(data, t, modifiedSchema[index].grid, component.uuid);
            }, 300)}
            onStop={() => {
              setRulePos({ x: NaN, y: NaN });
              setGapPos({ x: NaN, y: NaN } as any);
            }}
          >
            <div
              className={classNames('editor-canvas-item', {
                active: selectedComponent === component.uuid,
              })}
              key={modifiedSchema[index].uuid}
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
      <MRule pos={rulePos} />
      <MGap pos={gapPos} />
    </div>
  );
};

export default Canvas;
