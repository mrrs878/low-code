/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-27 19:36:53
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-28 14:19:41
 */

import React, { FC, useState } from 'react';
import { Popover, Button, Row } from 'antd';

interface IProps {
  onConfirm: () => void;
}

const DeleteBtn: FC<IProps> = ({
  onConfirm,
}) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  return (
    (
      <Popover
        content={(
          <div>
            <p style={{ paddingRight: '40px' }}>确定删除该组件吗？</p>
            <Row justify="space-between">
              <Button onClick={() => setVisible(false)}>取消</Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  onConfirm();
                  setVisible(false);
                }}
              >
                删除
              </Button>
            </Row>
          </div>
        )}
        title="提示"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Button danger>删除</Button>
      </Popover>
    )
  );
};

export default DeleteBtn;
