/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:05:44
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-10 09:25:43
 */

import React, { useRef, useState } from 'react';
import {
  MessageArgsProps,
  Button, ButtonProps, Input, InputProps, Layout,
} from 'antd';
import { createRoot } from 'react-dom/client';
import Canvas from 'Components/canvas';
import Material, { register } from 'Components/material';
import Operator from 'Components/operator';
import { Component, defineProps } from 'Components/material/registry';
import Tool from 'Components/tool';
import Provider from 'Store/provider';
import './index.less';

const { Sider, Content } = Layout;

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
    defineProps<ButtonProps>('String', {
      name: 'value',
      description: '按钮文字',
      default: 'Button',
      required: true,
    }),
    defineProps<ButtonProps>('Array', {
      name: 'onClick',
      description: '点击动作',
      default: '_',
      options: [
        {
          label: '提示',
          value: 'message',
          xProps: [
            {
              name: 'onClick.content',
              description: '提示内容',
              type: 'String',
              default: '提示内容',
              required: true,
            },
            {
              name: 'onClick.type',
              description: '提示类型',
              type: 'Array',
              default: 'info',
              required: false,
              options: [
                {
                  label: 'info',
                  value: 'info',
                },
                {
                  label: 'success',
                  value: 'success',
                },
                {
                  label: 'error',
                  value: 'error',
                },
                {
                  label: 'warning',
                  value: 'warning',
                },
              ],
            },
          ],
        },
        {
          label: '弹窗',
          value: 'modal',
        },
        {
          label: '无',
          value: '_',
        },
      ],
      required: true,
    }),
  ],
  grid: {
    w: 75,
    h: 32,
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
  grid: {
    w: 30,
    h: 24,
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
  resizable: 'w',
  grid: {
    w: 178,
    h: 32,
  },
});

register<MessageArgsProps>({
  label: 'Message',
  key: 'message',
  props: [
    defineProps('String', {
      name: 'content',
      description: '提示内容',
      default: 'balabala',
      required: true,
    }),
  ],
  render(props?) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Input placeholder="请输入" {...props} />;
  },
  preview() {
    return <> </>;
  },
  grid: {
    w: 100,
    h: 32,
  },
});

function App() {
  const [selectedComponent, setSelectedComponent] = useState<Component['uuid']>();
  const dragComponentRef = useRef<Component | null>(null);

  return (
    <Layout className="editor">
      <Sider theme="light" width={300}>
        <Material onDrop={(c) => { dragComponentRef.current = c; }} />
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
        <Operator
          component={selectedComponent}
        />
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
