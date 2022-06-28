/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:43:14
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-27 21:57:54
 */

import React, {
  FC, MutableRefObject,
} from 'react';
import classNames from 'classnames';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { Component } from '../material/registry';
import 'react-grid-layout/css/styles.css';
import './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export type CanvasRef = MutableRefObject<HTMLDivElement | null>;

interface IProps {
  containerRef: CanvasRef;
  components: Array<Component>;
  onSelect: (component?: Component) => void;
  selectedComponent: Component | undefined;
}

const Canvas: FC<IProps> = ({
  containerRef: ref,
  components,
  onSelect,
  selectedComponent,
}) => {
  console.log('[Canvas] render components', components);

  return (
    <div ref={ref} className={classNames('editor-canvas')}>
      <div
        className="editor-canvas-tool"
      >
        tool
      </div>
      <ResponsiveReactGridLayout
        cols={{
          lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
        }}
        rowHeight={32}
        margin={[0, 0]}
        // verticalCompact={false}
      >
        {
            components.map((component, index) => (
              <div
                className={classNames('editor-canvas-item', { active: selectedComponent?.uuid === component.uuid })}
                key={component.uuid}
                data-grid={{
                  w: 1, h: 1, x: index, y: Infinity,
                }}
                role="presentation"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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
