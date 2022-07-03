/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-29 11:11:17
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-03 10:45:45
 */

import { clone } from 'ramda';
import React, {
  FC, useCallback, useMemo, useState,
} from 'react';
import {
  StateContext, DispatchContext, IStateContext, IDispatchContext,
} from 'Store/context';
import { uuid as generateUUID } from 'Utils/index';
import { assignGridFromLayout, assignSchemaFromComponent } from './tool';

const Provider: FC<any> = ({
  children,
}) => {
  const [original, setOriginal] = useState<IStateContext['originalSchema']>([]);
  const [modified, setModified] = useState<IStateContext['modifiedSchema']>([]);

  const importSchema = useCallback((schema: string) => {
    setOriginal(JSON.parse(schema || '{}'));
    setModified(JSON.parse(schema || '{}'));
  }, []);

  const updateComponentProps = useCallback<IDispatchContext['updateComponentProps']>((u, p) => {
    setModified((_pre) => {
      const pre = clone(_pre);
      const s = pre.find((item) => item.uuid === u);
      if (!s) {
        return pre;
      }
      s.props = p.propsMap || s.props;
      s.xProps = p.xProps || s.xProps;
      return pre;
    });
  }, []);

  const dragComponent = useCallback<IDispatchContext['dragComponent']>((u, l) => {
    setModified((_pre) => {
      const pre = clone(_pre);
      const s = pre.find((item) => item.uuid === u);
      if (!s) {
        return pre;
      }
      s.grid = assignGridFromLayout(l);
      return pre;
    });
  }, []);

  const addComponent = useCallback<IDispatchContext['addComponent']>((c, l) => {
    setModified((_pre) => {
      const pre = clone(_pre);
      const s = assignSchemaFromComponent({ ...c, uuid: generateUUID() }, l);
      return pre.concat(s);
    });
  }, []);

  const deleteComponent = useCallback<IDispatchContext['deleteComponent']>((uuid) => {
    setModified((pre) => pre.filter((item) => item.uuid !== uuid));
  }, []);

  const state = useMemo<IStateContext>(() => ({
    originalSchema: original,
    modifiedSchema: modified,
  }), [original, modified]);

  const dispatch = useMemo<IDispatchContext>(() => ({
    importSchema,
    updateComponentProps,
    deleteComponent,
    addComponent,
    dragComponent,
  }), [addComponent, deleteComponent, dragComponent, importSchema, updateComponentProps]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default Provider;
