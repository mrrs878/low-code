/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-28 20:39:29
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 23:04:33
 */

import React, { FC, useContext, useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Button, Modal } from 'antd';
import { DiffOutlined, ExportOutlined } from '@ant-design/icons';
import { StateContext } from 'Store/context';

const Export: FC = () => {
  const [visible, setVisible] = useState(false);
  const { originalSchema, modifiedSchema } = useContext(StateContext);

  const close = () => setVisible(false);

  const open = () => setVisible(true);

  return (
    <>
      <Modal
        visible={visible}
        width={1200}
        title={(
          <span>
            Diff
            {' '}
            <DiffOutlined />
          </span>
        )}
        okButtonProps={{
          href: window.URL.createObjectURL(new Blob([JSON.stringify(modifiedSchema, null, 4)], { type: 'text/plain' })),
          download: 'schema.json',
          type: 'link',
        }}
        onCancel={close}
      >
        <DiffEditor
          height="60vh"
          language="json"
          original={JSON.stringify(originalSchema, null, 4)}
          modified={JSON.stringify(modifiedSchema, null, 4)}
        />
      </Modal>
      <Button type="primary" onClick={open} icon={<ExportOutlined />}>导出</Button>
    </>
  );
};

export default Export;
