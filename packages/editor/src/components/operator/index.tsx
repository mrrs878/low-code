/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:45:39
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 23:09:46
 */

import {
  Alert, Form, Input, Collapse, Switch, Divider, Typography, Row, Col, Button,
} from 'antd';
import React, { FC, useEffect } from 'react';
import { Component } from '../material/registry';
import DeleteBtn from './components/Delete';
import './index.less';

const { Panel } = Collapse;

interface IProps {
  component: Component | undefined;
  onSave: (uuid: Component, propsMap: Component['propsMap']) => void;
  onDelete: (uuid: Component['uuid']) => void;
}

const renderOption = (prop: any) => {
  let Option;
  switch (prop.type) {
    case Boolean:
      Option = <Switch defaultChecked={prop.value || prop.default} />;
      break;
    case String:
      Option = <Input placeholder={prop.value || prop.default} />;
      break;
    default:
      break;
  }
  return Option && (
    <Form.Item key={prop.name} label={prop.description} name={prop.name}>
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

  console.log('[Operator] component', component?.propsMap);

  useEffect(() => {
    if (component?.propsMap) {
      form.setFieldsValue(component?.propsMap);
    }
  }, [component?.propsMap, form]);

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
        <Panel className="editor-operator-component" header="组件属性" key="2">
          {
            component ? (
              <Form
                form={form}
                onFinish={() => {
                  console.log('[onFinish]', form.getFieldsValue(), component.uuid);
                  const values = form.getFieldsValue();

                  component.props?.forEach((prop) => {
                    // eslint-disable-next-line no-param-reassign
                    prop.value = values[prop.name];
                  });

                  onSave(component, values);
                }}
                initialValues={component.propsMap}
              >
                {
                  component.props?.map?.(renderOption)
                }
                <Divider />
                <Form.Item className="editor-operator-button-wrapper">
                  <Button htmlType="reset" onClick={() => form.resetFields()}>重置</Button>
                  <div style={{ flex: 1 }} />
                  <DeleteBtn onConfirm={() => onDelete(component.uuid)} />
                  <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
              </Form>
            ) : (
              <Typography.Text type="secondary">空空如也～</Typography.Text>
            )
          }
        </Panel>
      </Collapse>
    </div>
  );
};

export default Operator;
