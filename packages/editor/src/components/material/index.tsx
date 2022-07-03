/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:42:12
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 16:17:20
 */

import React, { FC } from 'react';
import { clone } from 'ramda';
import { props2propsMap } from 'Utils/index';
import {
  register, componentMap, components, Component,
} from './registry';
import './index.less';

interface IProps {
  onDrop: (c: Component) => void;
}

const Material: FC<IProps> = (({
  onDrop,
}) => (
  <div className="editor-material">
    {
          components.map((component) => (
            <div key={component.key} className="editor-material-item">
              <div
                draggable
                onDragStart={() => {
                  onDrop(clone({ ...component, propsMap: props2propsMap(component.props) }));
                }}
                className="editor-material-item__mask"
              >
                {component.preview()}
              </div>
            </div>
          ))
        }
  </div>
));

export default Material;

export { register, componentMap, components };
