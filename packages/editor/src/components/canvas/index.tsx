/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 23:00:55
 */

import React, {
  FC, MutableRefObject,
} from 'react';
import classNames from 'classnames';
import { WidthProvider, Responsive, Layout } from 'react-grid-layout';
import { Schema } from 'Store/context';
import 'react-grid-layout/css/styles.css';
import { Component, componentMap } from 'Components/material/registry';
import './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export type CanvasRef = MutableRefObject<HTMLDivElement | null>;

interface IProps {
  containerRef: CanvasRef;
  schema: Schema;
  onSelect: (component?: Component) => void;
  onDragStop: (layout: Array<Layout>) => void;
  selectedComponent: Component | undefined;
}

const Canvas: FC<IProps> = ({
  containerRef: ref,
  schema,
  onSelect,
  onDragStop,
  selectedComponent,
}) => {
  const components = schema.map((item) => ({
    ...item,
    ...componentMap[item.type],
    propsMap: item.props,
  })) as Array<Component>;

  console.log('[Canvas] render schema', schema, components);
  return (
    <div ref={ref} className={classNames('editor-canvas')}>
      <ResponsiveReactGridLayout
        cols={{
          lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
        }}
        rowHeight={32}
        margin={[0, 0]}
        verticalCompact={false}
        onDragStop={(layout) => {
          console.log('[Canvas] onDragStop', layout);
          onDragStop(layout);
        }}
      >
        {
          components.map((component, index) => (
            <div
              className={classNames('editor-canvas-item', { active: selectedComponent?.uuid === component.uuid })}
              key={schema[index].uuid}
              data-grid={schema[index].grid}
              role="presentation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Canvas] onClick', component);
                onSelect({
                  ...component,
                  propsMap: component.propsMap || component.props?.reduce(
                    (acc, cur) => ({ ...acc, [cur.name]: cur.value || cur.default }),
                    {},
                  ),
                });
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
      <div
        className="editor-canvas-line"
        role="presentation"
        onClick={() => {
          onSelect();
        }}
      />
    </div>
  );
};

export default Canvas;
