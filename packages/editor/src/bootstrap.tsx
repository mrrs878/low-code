/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:05:44
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 23:31:26
 */

import React, {
  useCallback, useContext, useRef, useState,
} from 'react';
import {
  Button, ButtonProps, Input, InputProps, Layout,
} from 'antd';
import { createRoot } from 'react-dom/client';
import { Layout as GridLayout } from 'react-grid-layout';
import Canvas from 'Components/canvas';
import Material, { register } from 'Components/material';
import Operator from 'Components/operator';
import { Component } from 'Components/material/registry';
import Tool from 'Components/tool';
import Provider from 'Store/provider';
import { DispatchContext, StateContext } from 'Store/context';
import { assignGridFromLayout, assignSchemaFromComponent } from 'Store/tool';
import useMaterialDrag from 'Hooks/use-material-drag';
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
  const canvasRef = useRef(null);
  const { modifiedSchema } = useContext(StateContext);
  const { updateComponent, deleteComponent } = useContext(DispatchContext);
  const [selectedComponent, setSelectedComponent] = useState<Component>();

  const onDrop = useCallback((c: Component) => {
    console.log('[onDrop]', c);
    updateComponent(assignSchemaFromComponent(c));
  }, [updateComponent]);

  const [onDragstart, onDragend] = useMaterialDrag({ canvasRef, onDrop });

  return (
    <Layout className="editor">
      <Sider theme="light" className="resize">
        <Operator
          component={selectedComponent}
          onSave={(c, p) => {
            console.log('[Operator] onSave');
            if (!c.uuid) {
              return;
            }
            const s = modifiedSchema.find((item) => item.uuid === c.uuid);
            if (!s) {
              return;
            }
            updateComponent({ ...s, props: p });
          }}
          onDelete={deleteComponent}
        />
      </Sider>
      <Content className="editor-content">
        <Tool />
        <Canvas
          onSelect={(c) => {
            console.log('[Canvas] onSelectComponent', c);
            setSelectedComponent(c);
          }}
          onDragStop={(l) => {
            console.log('[Canvas] onDragend', l);
            const tmp = l[0];
            if (modifiedSchema.length === 0) {
              updateComponent(assignSchemaFromComponent(selectedComponent!, tmp));
            }
            const s = modifiedSchema.find((item) => item.uuid === tmp.i);
            if (!s) {
              return;
            }
            updateComponent({ ...s, grid: assignGridFromLayout(l[0]) });
          }}
          schema={modifiedSchema}
          selectedComponent={selectedComponent}
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
  );
}

const root = createRoot(document.querySelector('#root')!);

root.render(
  <Provider>
    <App />
  </Provider>,
);
