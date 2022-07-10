/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-10 09:32:50
 */

import React, {
  FC, MutableRefObject, useContext, useRef, useState,
} from 'react';
import classNames from 'classnames';
import Draggable, { DraggableData } from 'react-draggable';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import {
  DispatchContext, Grid, StateContext,
} from 'Store/context';
import 'react-grid-layout/css/styles.css';
import { Component } from 'Components/material/registry';
import { schema2components } from 'Utils/index';
import './index.less';
import { remove } from 'ramda';

export type CanvasRef = MutableRefObject<HTMLDivElement | null>;

interface IProps {
  dragComponentRef: MutableRefObject<Component | null>;
  onSelect: (component?: Component['uuid']) => void;
  selectedComponent: Component['uuid'];
}

type Point = {
  x: number;
  y: number;
};

type GapPos = {
  x: number, y1: number, y2: number, y: number, x1: number, x2: number, gapY: number, gapX: number,
};

const THRESHOLD = 5;

const calculateRulePos = (grids: Array<Grid>, p: Grid) => {
  console.log('[calculateRuleItem] grids', grids);

  const res = {
    x: NaN, y: NaN, offsetY: 0, offsetX: 0,
  };

  if (grids.length === 1) {
    return res;
  }

  for (let index = 0; index < grids.length; index += 1) {
    const element = grids[index];
    if (Number.isNaN(res.y)) {
      // top - top
      if (Math.abs(p.y! - element.y!) < THRESHOLD) {
        res.y = element.y!;
      }
      // top - bottom
      if (Math.abs(p.y! - (element.y! + element.h)) < THRESHOLD) {
        res.y = element.y! + element.h;
      }
      // center - center
      if (Math.abs((p.y! + p.h! / 2) - (element.y! + element.h / 2)) < THRESHOLD) {
        res.y = element.y! + element.h / 2;
        res.offsetY = -p.h / 2;
      }
      // bottom - top
      if (Math.abs((p.y! + p.h) - element.y!) < THRESHOLD) {
        res.y = element.y!;
        res.offsetY = -p.h;
      }
      // bottom - bottom
      if (Math.abs((p.y! + p.h) - (element.y! + element.h)) < THRESHOLD) {
        res.y = res.y!;
      }
    }

    if (Number.isNaN(res.x)) {
      if (Math.abs(p.x! - element.x!) < THRESHOLD) {
        res.x = element.x!;
      }
      if (Math.abs(p.x! - (element.x! + element.w)) < THRESHOLD) {
        res.x = element.x! + element.w;
      }
      if (Math.abs((p.x! + p.w! / 2) - (element.x! + element.w / 2)) < THRESHOLD) {
        res.x = element.x! + element.w / 2;
        res.offsetX = -p.w / 2;
      }
      if (Math.abs((p.x! + p.w) - element.x!) < THRESHOLD) {
        res.x = element.x!;
        res.offsetX = -p.w;
      }
      if (Math.abs((p.x! + p.w) - (element.x! + element.w)) < THRESHOLD) {
        res.x = element.x! + element.w;
        res.offsetX = -p.w;
      }
    }
  }
  return res;
};

const calculateRuleGap = (grids: Array<Grid>, p: Grid) => {
  const res = {
    x: NaN, y1: NaN, y2: NaN, y: NaN, x1: NaN, x2: NaN, gapY: 0, gapX: 0,
  };
  if (grids.length <= 1) {
    return res;
  }
  let tmp = grids.sort((a, b) => (a.y! > b.y! ? 1 : -1)).slice(-2);
  let [p1, p2] = tmp;
  let gap = p2.y! - (p1.y! + p1.h);
  const y = (p2.y! + p2.h!) + gap;

  if (Math.abs(y - p.y!) < THRESHOLD) {
    res.x = p1.x!;
    res.y1 = p1.y! + p1.h;
    res.y2 = p2.y! + p2.h;
    res.gapY = gap;
  }

  tmp = grids.sort((a, b) => (a.x! > b.x! ? 1 : -1)).slice(-2);
  [p1, p2] = tmp;
  gap = p2.x! - (p1.x! + p1.w);
  const x = (p2.x! + p2.w!) + gap;

  console.log('[calculateRuleGap] p', grids, p2, p1);

  if (Math.abs(x - p.x!) < THRESHOLD) {
    res.y = p1.y!;
    res.x1 = p1.x! + p1.w;
    res.x2 = p2.x! + p2.w;
    res.gapX = gap;
  }
  return res;
};

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
    setRulePos(pos);
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
    setGapPos(gap);
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
      {
        !Number.isNaN(rulePos.y) && (
          <div
            className="rule rule-y"
            style={{
              left: 0,
              right: 0,
              top: rulePos.y + 10,
            }}
          />
        )
      }
      {
        !Number.isNaN(rulePos.y) && (
          <div
            className="rule rule-gap rule-y"
            style={{
              left: 0,
              right: 0,
              top: rulePos.y + 10,
            }}
          />
        )
      }
      {
        !Number.isNaN(rulePos.x) && (
          <div
            className="rule rule-x"
            style={{
              top: 0,
              bottom: 0,
              left: rulePos.x + 10,
            }}
          />
        )
      }
      {
        !Number.isNaN(gapPos.x) && (
        <>
          <div
            className="rule rule-gap-y"
            style={{
              top: gapPos.y1 + 10,
              height: gapPos.gapY,
              lineHeight: `${gapPos.gapY}px`,
              left: gapPos.x + 15,
            }}
          >
            <div className="rule-pos">
              &nbsp;
              {gapPos.gapY}
            </div>
          </div>
          <div
            className="rule rule-gap-y"
            style={{
              top: gapPos.y2 + 10,
              height: gapPos.gapY,
              lineHeight: `${gapPos.gapY}px`,
              left: gapPos.x + 15,
            }}
          >
            <div className="rule-pos">
              &nbsp;
              {gapPos.gapY}
            </div>
          </div>
        </>
        )
      }
      {
        !Number.isNaN(gapPos.y) && (
        <>
          <div
            className="rule rule-gap-x"
            style={{
              left: gapPos.x1 + 10,
              width: gapPos.gapX,
              top: gapPos.y + 10,
            }}
          >
            <div className="rule-pos">
              &nbsp;
              {gapPos.gapX}
            </div>
          </div>
          <div
            className="rule rule-gap-x"
            style={{
              left: gapPos.x2 + 10,
              width: gapPos.gapX,
              top: gapPos.y + 10,
            }}
          >
            <div className="rule-pos">
              &nbsp;
              {gapPos.gapX}
            </div>
          </div>
        </>
        )
      }
    </div>
  );
};

export default Canvas;
