/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-29 11:11:17
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-05 20:47:37
 */

import { clone } from 'ramda';
import React, {
  FC, useCallback, useMemo, useState,
} from 'react';
import {
  StateContext, DispatchContext, IStateContext, IDispatchContext, DefaultStateContext,
} from 'Store/context';
import { uuid as generateUUID } from 'Utils/index';
import { assignSchemaFromComponent } from './tool';

const Provider: FC<any> = ({
  children,
}) => {
  const [original, setOriginal] = useState<IStateContext['originalSchema']>(DefaultStateContext.originalSchema);
  const [modified, setModified] = useState<IStateContext['modifiedSchema']>(DefaultStateContext.modifiedSchema);

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
      s.grid = p.grid || s.grid;
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
      s.grid = { ...s.grid, ...l };
      return pre;
    });
  }, []);

  const addComponent = useCallback<IDispatchContext['addComponent']>((c, l) => {
    const s = assignSchemaFromComponent({ ...c, uuid: generateUUID() }, l);
    setModified((_pre) => {
      const pre = clone(_pre);
      return pre.concat(s);
    });
    return s.uuid;
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
