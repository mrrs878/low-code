/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 10:45:39
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-28 10:23:28
 */

import {
  Alert, Form, Input, Collapse, Switch, Divider, Typography, Row, Col, Button,
} from 'antd';
import React, { FC } from 'react';
import { Component } from '../material/registry';
import DeleteBtn from './components/Delete';
import './index.less';

const { Panel } = Collapse;

interface IProps {
  component: Component | undefined;
  onSave: (uuid: Component['uuid'], props: Component['props'], propsMap: Component['propsMap']) => void;
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
}) => {
  const [form] = Form.useForm();

  if (component) {
    form.resetFields();
  }

  console.log('[Operator] component', component);

  return (
    <div className="editor-operator">
      <Alert message="属性编辑" type="success" />
      <Collapse className="editor-operator-collapse" defaultActiveKey={['2']}>
        <Panel header="画布" key="1">
          <Row gutter={16}>
            <Col>
              <Form.Item label="网格线">
                <Switch defaultChecked />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="自动对齐到网格线">
                <Switch defaultChecked />
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
                  const propsMap: Component['propsMap'] = component.props?.reduce((acc, cur) => (
                    { ...acc, [cur.name]: { ...cur, value: values[cur.name] } }
                  ), {});
                  if (!propsMap) {
                    return;
                  }
                  Reflect.ownKeys(values).forEach((key) => {
                    propsMap[key as string].value ||= values[key];
                  });
                  const props = Reflect.ownKeys(propsMap).reduce((acc: any, cur: any) => ([...acc, propsMap[cur]]), []) as any as Component['props'];
                  onSave(component.uuid, props, values);
                }}
                initialValues={
                  component.props!.reduce(
                    (acc, cur) => ({ ...acc, [cur.name]: cur.value || cur.default }),
                    {},
                  )
                }
              >
                {
                  component.props?.map?.(renderOption)
                }
                <Divider />
                <Form.Item className="editor-operator-button-wrapper">
                  <Button htmlType="reset" onClick={() => form.resetFields()}>重置</Button>
                  <div style={{ flex: 1 }} />
                  <DeleteBtn onClick={() => {
                    console.log('[delete]');
                  }}
                  />
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
