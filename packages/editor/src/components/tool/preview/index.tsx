/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-07-03 10:56:28
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 20:02:25
 */

import React, { useContext, useEffect, useState } from 'react';
import { FundViewOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { StateContext } from 'Store/context';
import Draggable from 'react-draggable';
import useContainerHeight from 'Hooks/use-container-height';
import * as parser from '../../../parser';

const Preview = () => {
  const { modifiedSchema } = useContext(StateContext);
  const [visible, setVisible] = useState(false);
  const [setContainerHight] = useContainerHeight('.editor-tool-preview-content');
  const close = () => setVisible(false);

  const open = () => setVisible(true);

  useEffect(() => {
    if (visible) {
      setTimeout(setContainerHight);
    }
  }, [setContainerHight, visible]);

  return (
    <div className="editor-tool-preview">
      <Modal
        visible={visible}
        width="80vw"
        onCancel={close}
        footer={false}
        title={(
          <span>
            预览
            {' '}
            <FundViewOutlined />
          </span>
        )}
        destroyOnClose
      >
        <div className="editor-tool-preview-content">
          {
            modifiedSchema.map((item) => (
              <Draggable
                disabled
                position={{ x: item.grid.x!, y: item.grid.y! }}
                key={item.uuid}
              >
                {(parser as any)[item.type]?.({ props: item.props, xProps: item.xProps })}
              </Draggable>
            ))
          }
        </div>
      </Modal>
      <Button icon={<FundViewOutlined />} onClick={open}>预览</Button>
    </div>
  );
};

export default Preview;
