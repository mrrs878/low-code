/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:45:39
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-02 23:18:57
 */

import {
  Alert, Form, Input, Collapse, Switch, Divider, Typography, Row, Col, Button, message,
  Select, Drawer, Space,
} from 'antd';
import { keys } from 'ramda';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { props2propsMap } from 'Utils/index';
import { Component, ComponentOption } from '../material/registry';
import DeleteBtn from './components/Delete';
import './index.less';

const { Panel } = Collapse;

const setByPath = (obj: any, path: string, value: any) => {
  path.split('.').reduce((acc, cur, index) => {
    if (index === path.split('.').length - 1) {
      acc[cur] = value;
    } else {
      acc[cur] = {};
    }
    return acc[cur];
  }, obj);
};

interface IProps {
  component: Component | undefined;
  onSave: (uuid: Component['uuid'], propsMap: Component['propsMap']) => Promise<string>;
  onDelete: (uuid: Component['uuid']) => void;
}

const renderOption = (prop: any, { onSelect }: any) => {
  if (!prop) {
    return <> </>;
  }

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
  component,
  onSave,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const [xPropsForm] = Form.useForm();
  const [showXProps, setShowXProps] = useState(false);
  const contextRenderRef = useRef<Array<any>>([]);

  console.log('[Operator] component', component?.propsMap);

  useEffect(() => {
    if (component?.propsMap) {
      form.setFieldsValue(component?.propsMap);
    }
  }, [component?.propsMap, form]);

  const closeXPropsDrawer = () => setShowXProps(false);

  const onSelect = (propIndex: number, optIndex: number) => {
    console.log('[Operator] onSelect', propIndex, optIndex);
    contextRenderRef.current = (component?.props?.[propIndex]?.options?.[optIndex] as any)?.xProps;
    setShowXProps(true);
  };

  return (
    <div className="editor-operator">
      <Alert message="属性编辑" type="success" />
      <Collapse className="editor-operator-collapse" defaultActiveKey={['2']}>
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
        <Panel className="editor-operator-component" header="组件属性" key="3">
          {
            component
              ? (
                <Form
                  form={form}
                  onFinish={() => {
                    console.log('[onFinish]', form.getFieldsValue(), component.uuid);
                    const values = form.getFieldsValue();

                    component.props?.forEach((prop) => {
                      // eslint-disable-next-line no-param-reassign
                      prop.value = values[prop.name];
                    });

                    onSave(component.uuid, values)
                      .then((res) => {
                        message.info(res);
                      }).catch((err) => {
                        message.error(err);
                      });
                  }}
                  initialValues={component?.propsMap}
                >
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
                  <Form.Item className="editor-operator-button-wrapper">
                    <Button htmlType="reset" onClick={() => form.resetFields()}>重置</Button>
                    <div style={{ flex: 1 }} />
                    <DeleteBtn onConfirm={() => onDelete(component.uuid)} />
                    <Button type="primary" htmlType="submit">保存</Button>
                  </Form.Item>
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
                onFinish={(e) => {
                  const values = form.getFieldsValue();
                  keys(e).forEach((key) => {
                    setByPath(values, key as string, e[key]);
                  });

                  onSave(component?.uuid, values)
                    .then((res) => {
                      message.info(res);
                    }).catch((err) => {
                      message.error(err);
                    });
                  closeXPropsDrawer();
                }}
              >
                {contextRenderRef.current?.map?.((props: any) => renderOption(props, { onSelect }))}
                <Space>
                  <Button htmlType="reset">重置</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </Space>
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
