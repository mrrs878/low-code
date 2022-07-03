/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 21:10:18
 */

import React, {
  FC, MutableRefObject, useContext,
} from 'react';
import classNames from 'classnames';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { DispatchContext, StateContext } from 'Store/context';
import 'react-grid-layout/css/styles.css';
import { Component } from 'Components/material/registry';
import { schema2components } from 'Utils/index';
import './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export type CanvasRef = MutableRefObject<HTMLDivElement | null>;

interface IProps {
  dragComponentRef: MutableRefObject<Component | null>;
  onSelect: (component?: Component) => void;
  selectedComponent: Component | undefined;
}

const Canvas: FC<IProps> = ({
  dragComponentRef,
  onSelect,
  selectedComponent,
}) => {
  const { modifiedSchema } = useContext(StateContext);
  const { addComponent, dragComponent } = useContext(DispatchContext);

  const components = schema2components(modifiedSchema);

  console.log('[Canvas] render schema', modifiedSchema, components);
  return (
    <ResponsiveReactGridLayout
      cols={{
        lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
      }}
      className={classNames('editor-canvas')}
      rowHeight={32}
      isDroppable
      measureBeforeMount={false}
      useCSSTransforms={false}
      verticalCompact={false}
      onDragStop={(_, __, layout) => {
        console.log('[Canvas] onDragStop', layout);
        dragComponent(layout.i, layout);
      }}
      onDrop={(_, l) => {
        console.log('[Canvas] onDrop', l);
        addComponent(dragComponentRef.current!, l);
      }}
    >
      {
          components.map((component, index) => (
            <div
              className={classNames('editor-canvas-item', { active: selectedComponent?.uuid === component.uuid })}
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
                if (selectedComponent?.uuid === component.uuid) {
                  onSelect();
                  return;
                }
                onSelect(component);
              }}
            >
              <div
                className="editor-canvas-item__mask"
              >
                {component.render(component.propsMap)}
              </div>
            </div>
          ))
        }
    </ResponsiveReactGridLayout>
  );
};

export default Canvas;
