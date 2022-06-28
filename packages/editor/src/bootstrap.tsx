/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:05:44
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-28 09:55:34
 */

import React, {
  useCallback, useRef, useState,
} from 'react';
import {
  Button, ButtonProps, Input, InputProps, Layout,
} from 'antd';
import { createRoot } from 'react-dom/client';
import Material, { register } from './components/material';
import Canvas from './components/canvas';
import Operator from './components/operator';
import './index.less';
import Provider from './store';
import useMaterialDrag from './hooks/use-material-drag';
import { Component } from './components/material/registry';

const { Sider, Content } = Layout;

register({
  label: 'Row',
  key: 'row',
  render() {
    return <div style={{ height: '100%', background: '#ddd' }}> </div>;
  },
  preview() {
    return (
      <div>占位</div>
    );
  },
});

register<ButtonProps>({
  label: 'Button',
  key: 'button',
  render(props?) {
    console.log('[Button] render', props);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Button {...props}>{props?.value || 'Button'}</Button>;
  },
  preview() {
    return <Button>Button</Button>;
  },
  props: [
    {
      name: 'value',
      description: '按钮文字',
      type: String,
      default: 'Button',
    },
    {
      name: 'onClick',
      description: '点击动作',
      type: Function,
      default: () => {},
    },
    {
      name: 'block',
      description: '将按钮宽度调整为其父宽度的选项',
      type: Boolean,
      default: false,
    },
  ],
});

register({
  label: 'Text',
  key: 'text',
  render() {
    return '文本';
  },
  preview() {
    return '文本';
  },
});

register<InputProps>({
  label: 'Input',
  key: 'input',
  render(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Input placeholder="请输入" {...props} />;
  },
  preview() {
    return <Input placeholder="请输入" />;
  },
});

function App() {
  const canvasRef = useRef(null);
  const [components, setComponents] = useState<Array<Component>>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component>();

  const onDrop = useCallback((c: Component) => {
    console.log('[onDrop]', c);
    setComponents((pre) => {
      console.log('[setComponents]', pre);
      return pre.concat(c);
    });
  }, []);

  const [onDragstart, onDragend] = useMaterialDrag({ canvasRef, onDrop });

  return (
    <Provider>
      <Layout className="editor">
        <Sider theme="light" className="resize">
          <Operator
            component={selectedComponent}
            onSave={(u, p, m) => {
              console.log('[Operator] onSave', u, p);
              setComponents((c) => {
                const i = c.findIndex((item) => item.uuid === u);
                if (i !== -1) {
                  // eslint-disable-next-line no-param-reassign
                  c[i].props = p;
                  // eslint-disable-next-line no-param-reassign
                  c[i].propsMap = m;
                }
                console.log('[Operator] setComponents', c);
                return [...c];
              });
            }}
          />
        </Sider>
        <Content>
          <Canvas
            onSelect={(c) => {
              console.log('[Canvas] onSelectComponent', c?.props);
              setSelectedComponent(c);
            }}
            selectedComponent={selectedComponent}
            components={components}
            containerRef={canvasRef}
          />
        </Content>
        <Sider theme="light" width={300}>
          <Material
            onDragstart={onDragstart}
            onDragend={onDragend}
          />
        </Sider>

      </Layout>
    </Provider>
  );
}

const root = createRoot(document.querySelector('#root')!);

root.render(<App />);
