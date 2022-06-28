/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-28 20:39:29
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-28 21:40:04
 */

import React, { FC, useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Button, Modal } from 'antd';
import { DiffOutlined, ExportOutlined } from '@ant-design/icons';

interface IProps {
  original: string;
  modified: string;
}

const Export: FC<IProps> = ({
  original,
  modified,
}) => {
  const [visible, setVisible] = useState(false);

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
          href: window.URL.createObjectURL(new Blob([modified], { type: 'text/plain' })),
          download: 'schema.json',
          type: 'link',
        }}
        onCancel={close}
      >
        <DiffEditor
          height="60vh"
          language="json"
          original={original}
          modified={modified}
        />
      </Modal>
      <Button type="primary" onClick={open} icon={<ExportOutlined />}>导出</Button>
    </>
  );
};

export default Export;
