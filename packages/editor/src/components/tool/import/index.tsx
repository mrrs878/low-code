/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-28 21:36:45
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 10:58:44
 */

import { ImportOutlined, UploadOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import {
  Button, Modal, Row, Upload,
} from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useContext, useRef, useState } from 'react';
import { OnMount } from '@monaco-editor/react/lib/types';
import { DispatchContext } from 'Store/context';

const Import = () => {
  const [fileList] = useState<Array<UploadFile>>([]);
  const [visible, setVisible] = useState(false);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const { importSchema } = useContext(DispatchContext);

  const close = () => setVisible(false);

  const open = () => setVisible(true);

  const onConfirm = () => {
    close();
    const content = editorRef.current?.getValue();
    if (content) {
      importSchema(content);
    }
  };

  return (
    <>
      <Modal
        title="导入"
        visible={visible}
        onCancel={close}
        width={1200}
        footer={(
          <Row justify="space-between">
            <Upload
              fileList={fileList}
              accept=".json"
              maxCount={1}
              beforeUpload={() => false}
              showUploadList={false}
              onChange={async (e) => {
                const context = await e.fileList[0].originFileObj?.text();
                console.log('[Import] Upload changed', context);
                if (context) {
                  editorRef.current?.setValue(context);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <div style={{ flex: 1 }} />
            <Button onClick={close}>取消</Button>
            <Button type="primary" onClick={onConfirm}>确认</Button>
          </Row>
        )}
      >
        <Editor
          height="60vh"
          language="json"
          onMount={(editor) => { editorRef.current = editor; }}
        />
      </Modal>
      <Button icon={<ImportOutlined />} onClick={open}>导入</Button>
    </>
  );
};

export default Import;
