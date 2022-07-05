/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:45:39
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 22:00:07
 */

import {
  Alert, Form, Input, Collapse, Switch, Divider, Typography, Row, Col, Button, message,
  Select, Drawer, Space,
} from 'antd';
import React, {
  FC, useContext, useEffect, useRef, useState,
} from 'react';
import { Component, componentMap, ComponentOption } from 'Components/material/registry';
import { DispatchContext, StateContext } from 'Store/context';
import DeleteBtn from './components/Delete';
import './index.less';

const { Panel } = Collapse;

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
      name={[config.prefix, ...prop.name.split('.')]}
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
  const [showXProps, setShowXProps] = useState(false);
  const contextRenderRef = useRef<Array<any>>([]);

  const schemaConfig = modifiedSchema.find((item) => item.uuid === c);
  const component = componentMap[schemaConfig?.type || ''];

  console.log('[Operator] component', schemaConfig);

  useEffect(() => {
    if (schemaConfig) {
      form.setFieldsValue(schemaConfig);
    }
  }, [form, schemaConfig]);

  const closeXPropsDrawer = () => setShowXProps(false);

  const onSelect = (propIndex: number, optIndex: number) => {
    contextRenderRef.current = (component?.props?.[propIndex]?.options?.[optIndex] as any)?.xProps;
    console.log('[Operator] onSelect', propIndex, optIndex, contextRenderRef.current, schemaConfig?.xProps);
    setShowXProps(!!contextRenderRef.current);
  };

  return (
    <div className="editor-operator">
      <Form
        form={form}
        onFinish={(value) => {
          try {
            console.log('[onFinish]', value);
            updateComponentProps(schemaConfig?.uuid, value);
            message.info('保存成功');
          } catch (e) {
            message.error(JSON.stringify(e));
          }
        }}
        initialValues={schemaConfig}
      >
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
                  <>
                    <Space>
                      <Form.Item name={['grid', 'x']} label="x" required>
                        <Input type="number" />
                      </Form.Item>
                      <Form.Item name={['grid', 'y']} label="y" required>
                        <Input type="number" />
                      </Form.Item>
                    </Space>
                    <Space>
                      <Form.Item name={['grid', 'w']} label="w" required>
                        <Input type="number" disabled={!component.resizable} />
                      </Form.Item>
                      <Form.Item name={['grid', 'h']} label="h" required>
                        <Input type="number" disabled={!component.resizable} />
                      </Form.Item>
                    </Space>
                    {
                      component.props?.map?.((props, index) => renderOption(
                        props,
                        {
                          prefix: 'props',
                          onSelect: (_: any, e: any) => {
                            onSelect(index, e.index);
                            console.log('[operator] onSelect', e);
                          },
                        },
                      ))
                    }
                  </>
                )
                : (
                  <Typography.Text type="secondary">空空如也～</Typography.Text>
                )
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
              ? contextRenderRef.current?.map?.((props: any) => renderOption(props, { prefix: 'xProps' }))
              : (
                <Typography.Text type="secondary">空空如也～</Typography.Text>
              )
          }
        </Drawer>
        <Divider />
        <Space align="end">
          <DeleteBtn
            onConfirm={() => {
              deleteComponent(schemaConfig?.uuid);
            }}
          />
          <Button type="primary" htmlType="submit">保存</Button>
        </Space>
      </Form>
    </div>
  );
};

export default Operator;
