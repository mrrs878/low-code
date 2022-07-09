/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-09 15:48:05
 */

import React, {
  FC, MutableRefObject, useContext, useRef, useState,
} from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
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

const THRESHOLD = 5;

const calculateRulePos = (grids: Array<Grid>, p: Grid) => {
  console.log('[calculateRuleItem] grids', grids);

  const res = {
    x: NaN, y: NaN, offsetY: 0, offsetX: 0,
  };

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

const CANVAS_POS = {
  grid: {
    x: 0,
    y: 0,
    w: 1300,
    h: 390,
  },
};

const Canvas: FC<IProps> = ({
  dragComponentRef,
  onSelect,
  selectedComponent,
}) => {
  const { modifiedSchema } = useContext(StateContext);
  const { addComponent, dragComponent } = useContext(DispatchContext);

  const [rulePos, setRulePos] = useState<Point>({ x: NaN, y: NaN });

  const components = schema2components(modifiedSchema);

  const canvas = useRef<HTMLDivElement | null>(null);

  const grids = [modifiedSchema, CANVAS_POS].flat().map(({ grid }) => grid);

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
          x, y, w: grid?.w, h: grid?.h,
        });

        onSelect(u);
      }, 100)}
    >
      {
        components.map((component, index) => (
          <Draggable
            bounds=".editor-canvas"
            position={{ x: modifiedSchema[index].grid.x!, y: modifiedSchema[index].grid.y! }}
            offsetParent={document.querySelector<HTMLDivElement>('.editor-canvas') || undefined}
            onDrag={throttle((_, data) => {
              let { x, y } = data;
              const { w, h } = modifiedSchema[index].grid;
              const pos = calculateRulePos(remove(index, 1, grids), {
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
              dragComponent(component.uuid, {
                x: x + pos.offsetX, y: y + pos.offsetY,
              });
            }, 300)}
            onStop={() => {
              setRulePos({ x: NaN, y: NaN });
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
    </div>
  );
};

export default Canvas;
