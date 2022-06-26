/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:42:12
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 15:27:59
 */

import React, { FC } from 'react';
import {
  register, componentMap, components, Component,
} from './registry';
import './index.less';

interface IProps {
  onDragstart: (e: React.DragEvent<HTMLDivElement>, component: Component) => void;
  onDragend: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Material: FC<IProps> = ({
  onDragstart,
  onDragend,
}) => (
  <div className="editor-material">
    {
        components.map((component) => (
          <div key={component.key} className="editor-material-item">
            <div
              draggable
              onDragStart={(e) => onDragstart(e, component)}
              onDragEnd={onDragend}
              className="editor-material-item__mask"
            >
              {component.preview()}
            </div>
          </div>
        ))
      }
  </div>
);

export default Material;

export { register, componentMap, components };
