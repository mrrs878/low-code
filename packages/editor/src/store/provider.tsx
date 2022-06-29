/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-29 11:11:17
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 23:07:12
 */

import React, {
  FC, useCallback, useMemo, useState,
} from 'react';
import {
  StateContext, DispatchContext, IStateContext, IDispatchContext,
} from 'Store/context';

const Provider: FC<any> = ({
  children,
}) => {
  const [original, setOriginal] = useState<IStateContext['originalSchema']>([]);
  const [modified, setModified] = useState<IStateContext['originalSchema']>([]);

  const importSchema = useCallback((schema: string) => {
    setOriginal(JSON.parse(schema));
  }, []);

  const updateComponent = useCallback<IDispatchContext['updateComponent']>((s) => {
    setModified((pre) => {
      if (pre.length === 0) {
        return [s];
      }
      const tmp = pre.findIndex((item) => item.uuid === s.uuid);
      if (tmp === -1) {
        return pre;
      }
      return [...pre.slice(0, tmp), s, ...pre.slice(tmp + 1)];
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
    updateComponent,
    deleteComponent,
  }), [deleteComponent, importSchema, updateComponent]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default Provider;
