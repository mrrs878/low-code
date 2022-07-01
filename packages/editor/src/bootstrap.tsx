/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:05:44
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-01 10:19:19
 */

import React, { useContext, useRef, useState } from 'react';
import {
  Button, ButtonProps, Input, InputProps, Layout,
} from 'antd';
import { createRoot } from 'react-dom/client';
import Canvas from 'Components/canvas';
import Material, { register } from 'Components/material';
import Operator from 'Components/operator';
import { Component } from 'Components/material/registry';
import Tool from 'Components/tool';
import Provider from 'Store/provider';
import { DispatchContext } from 'Store/context';
import './index.less';

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
  const { updateComponent, deleteComponent } = useContext(DispatchContext);
  const [selectedComponent, setSelectedComponent] = useState<Component>();
  const dragComponentRef = useRef<Component | null>(null);

  return (
    <Layout className="editor">
      <Sider theme="light" className="resize">
        <Operator
          component={selectedComponent}
          onSave={(u, p) => {
            console.log('[Operator] onSave');
            if (!u) {
              return Promise.reject(new Error('组件不存在'));
            }
            updateComponent(u, p);
            return Promise.resolve('保存成功');
          }}
          onDelete={(c) => {
            setSelectedComponent(undefined);
            deleteComponent(c);
          }}
        />
      </Sider>
      <Content className="editor-content">
        <Tool />
        <Canvas
          dragComponentRef={dragComponentRef}
          onSelect={(c) => {
            console.log('[Canvas] onSelectComponent', c);
            setSelectedComponent(c);
          }}
          selectedComponent={selectedComponent}
        />
      </Content>
      <Sider theme="light" width={300}>
        <Material onDrop={(c) => { dragComponentRef.current = c; }} />
      </Sider>
    </Layout>
  );
}

const root = createRoot(document.querySelector('#root')!);

root.render(
  <Provider>
    <App />
  </Provider>,
);
