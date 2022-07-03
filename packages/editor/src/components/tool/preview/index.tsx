/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-07-03 10:56:28
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 21:24:15
 */

import React, { useContext, useState } from 'react';
import { FundViewOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { StateContext } from 'Store/context';
import * as parser from '../../../parser';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Preview = () => {
  const { modifiedSchema } = useContext(StateContext);
  const [visible, setVisible] = useState(false);

  const close = () => setVisible(false);

  const open = () => setVisible(true);

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
        {
          visible && (
            <ResponsiveReactGridLayout
              cols={{
                lg: 17, md: 10, sm: 6, xs: 4, xxs: 2,
              }}
              margin={[10, 10]}
              rowHeight={32}
              isDraggable={false}
              isResizable={false}
            >
              {
                modifiedSchema.map((item) => (
                  <div
                    key={item.uuid}
                    data-grid={item.grid}
                  >
                    {(parser as any)[item.type]?.({ props: item.props, xProps: item.xProps })}
                  </div>
                ))
              }
            </ResponsiveReactGridLayout>
          )
        }
      </Modal>
      <Button icon={<FundViewOutlined />} onClick={open}>预览</Button>
    </div>
  );
};

export default Preview;
