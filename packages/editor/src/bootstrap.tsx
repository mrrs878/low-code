/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:05:44
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-26 21:58:47
 */

import React, {
  useCallback, useRef, useState,
} from 'react';
import {
  Button, Input, Layout,
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

register({
  label: 'Button',
  key: 'button',
  render(props?) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Button {...props}>Button</Button>;
  },
  preview() {
    return <Button>Button</Button>;
  },
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

register({
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
        <Sider theme="light" width={300}>
          <Material
            onDragstart={onDragstart}
            onDragend={onDragend}
          />
        </Sider>
        <Content>
          <Canvas
            onSelect={(c) => {
              console.log('[Canvas] onSelectComponent', c);
              setSelectedComponent(c);
            }}
            selectedComponent={selectedComponent}
            components={components}
            containerRef={canvasRef}
          />
        </Content>
        <Sider theme="light" width={300}>
          <Operator />
        </Sider>
      </Layout>
    </Provider>
  );
}

const root = createRoot(document.querySelector('#root')!);

root.render(<App />);
