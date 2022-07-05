/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:45:39
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 21:19:00
 */

import {
  Alert, Form, Input, Collapse, Switch, Divider, Typography, Row, Col, Button, message,
  Select, Drawer, Space,
} from 'antd';
import { keys, omit } from 'ramda';
import React, {
  FC, useContext, useEffect, useRef, useState,
} from 'react';
import { props2propsMap } from 'Utils/index';
import { Component, componentMap, ComponentOption } from 'Components/material/registry';
import { DispatchContext, StateContext } from 'Store/context';
import DeleteBtn from './components/Delete';
import './index.less';

const { Panel } = Collapse;

const setByPath = (obj: any, path: string, value: any) => {
  path.split('.').reduce((acc, cur, index) => {
    if (index === path.split('.').length - 1) {
      acc[cur] = value;
    } else {
      acc[cur] ||= {};
    }
    return acc[cur];
  }, obj);
};

interface IProps {
  component: Component['uuid'];
}

const renderOption = (prop: any, config: any = {}) => {
  if (!prop) {
    return <> </>;
  }

  const { onSelect = () => {} } = config;

  let Option;
  let valuePropName = 'value';
  switch (prop.type) {
    case Boolean:
      Option = <Switch />;
      valuePropName = 'checked';
      break;
    case String:
      Option = <Input />;
      break;
    case Array:
      Option = (
        <Select
          placeholder="请选择"
          onSelect={onSelect}
        >
          {
            prop.options.map((option: ComponentOption, index: number) => (
              typeof option === 'string'
                ? <Select.Option key={option}>{option}</Select.Option>
                : <Select.Option index={index} key={option.value}>{option.label}</Select.Option>
            ))
          }
        </Select>
      );
      break;
    default:
      break;
  }
  return Option && (
    <Form.Item
      valuePropName={valuePropName}
      key={prop.name}
      required={prop.required}
      label={prop.description}
      name={prop.name}
      rules={prop.required ? [{ required: true }] : []}
    >
      {Option}
    </Form.Item>
  );
};

const Operator: FC<IProps> = ({
  component: c,
}) => {
  const { modifiedSchema } = useContext(StateContext);
  const { updateComponentProps, deleteComponent } = useContext(DispatchContext);
  const [form] = Form.useForm();
  const [xPropsForm] = Form.useForm();
  const [showXProps, setShowXProps] = useState(false);
  const contextRenderRef = useRef<Array<any>>([]);

  const schemaConfig = modifiedSchema.find((item) => item.uuid === c);
  const component = componentMap[schemaConfig?.type || ''];

  console.log('[Operator] component', component);

  useEffect(() => {
    if (schemaConfig) {
      form.setFieldsValue({
        ...schemaConfig?.props,
        x: schemaConfig?.grid?.x,
        y: schemaConfig?.grid?.y,
        w: schemaConfig?.grid?.w,
        h: schemaConfig?.grid?.h,
      });
    }
  }, [form, schemaConfig]);

  const closeXPropsDrawer = () => setShowXProps(false);

  const onSelect = (propIndex: number, optIndex: number) => {
    console.log('[Operator] onSelect', propIndex, optIndex);
    contextRenderRef.current = (component?.props?.[propIndex]?.options?.[optIndex] as any)?.xProps;
    setShowXProps(!!contextRenderRef.current);
  };

  return (
    <div className="editor-operator">
      <Alert message="属性编辑" type="success" />
      <Collapse className="editor-operator-collapse" defaultActiveKey={['2']} bordered={false}>
        <Panel header="画布" key="1">
          <Row gutter={16}>
            <Col>
              <Form.Item label="网格线">
                <Switch disabled />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="自动对齐到网格线">
                <Switch disabled />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
        <Panel className="editor-operator-component" header="组件属性" key="2">
          {
            component
              ? (
                <Form
                  form={form}
                  onFinish={() => {
                    try {
                      const propsMap = form.getFieldsValue();
                      const xPropsTmp = xPropsForm.getFieldsValue();
                      const xProps = {};

                      keys(xPropsTmp).forEach((key) => {
                        setByPath(xProps, key as string, xPropsTmp[key]);
                      });

                      const {
                        x, y, w, h,
                      } = propsMap;

                      console.log('[onFinish]', propsMap, form.getFieldsValue(), component.uuid);
                      updateComponentProps(schemaConfig?.uuid, {
                        propsMap: omit(['x', 'y', 'w', 'h'], propsMap),
                        xProps,
                        grid: {
                          x: Number(x), y: Number(y), w: Number(w), h: Number(h),
                        },
                      });
                      message.info('保存成功');
                    } catch (e) {
                      message.error(JSON.stringify(e));
                    }
                  }}
                  initialValues={schemaConfig?.props}
                >
                  <Space>
                    <Form.Item name="x" label="x" required initialValue={component.grid?.x}>
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item name="y" label="y" required initialValue={component.grid?.y}>
                      <Input type="number" />
                    </Form.Item>
                  </Space>
                  <Space>
                    <Form.Item name="w" label="w" required initialValue={component.grid?.w}>
                      <Input type="number" disabled={!component.resizable} />
                    </Form.Item>
                    <Form.Item name="h" label="h" required initialValue={component.grid?.h}>
                      <Input type="number" disabled={!component.resizable} />
                    </Form.Item>
                  </Space>
                  {
                    component.props?.map?.((props, index) => renderOption(
                      props,
                      {
                        onSelect: (_: any, e: any) => {
                          onSelect(index, e.index);
                          console.log('[operator] onSelect', e);
                        },
                      },
                    ))
                  }
                  <Divider />
                  <Row justify="end">
                    <Form.Item className="editor-operator-button-wrapper">
                      <DeleteBtn
                        onConfirm={() => {
                          deleteComponent(schemaConfig?.uuid);
                        }}
                      />
                      <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                  </Row>
                </Form>
              )
              : <Typography.Text type="secondary">空空如也～</Typography.Text>
          }
        </Panel>
      </Collapse>
      <Drawer
        placement="right"
        width={500}
        onClose={closeXPropsDrawer}
        title="编辑属性"
        visible={showXProps}
      >
        {
          contextRenderRef.current
            ? (
              <Form
                layout="vertical"
                form={xPropsForm}
                initialValues={props2propsMap(contextRenderRef.current)}
              >
                {contextRenderRef.current?.map?.((props: any) => renderOption(props))}
              </Form>
            ) : (
              <Typography.Text type="secondary">空空如也～</Typography.Text>
            )
        }
      </Drawer>
    </div>
  );
};

export default Operator;
