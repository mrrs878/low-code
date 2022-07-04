/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-29 11:11:21
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-07-04 22:14:11
 */

import { createContext } from 'react';
import { Component } from 'Components/material/registry';
import { Layout } from 'react-grid-layout';

type Grid = {
  x: number, y: number
};

type Schema = Array<{
  type: string;
  uuid: string;
  props: Component['propsMap'];
  xProps: Component['xProps'];
  grid: Grid;
}>;

interface IStateContext {
  originalSchema: Schema;
  modifiedSchema: Schema;
}

interface IDispatchContext {
  importSchema: (content: string) => void;
  updateComponentProps: (u: Component['uuid'], p: Pick<Component, 'propsMap' | 'xProps' | 'grid'>) => void;
  dragComponent: (u: Component['uuid'], l: Layout) => void;
  addComponent: (c: Component, l: Layout) => void;
  deleteComponent: (u: Schema[0]['uuid'] | undefined) => void;
}

const DefaultStateContext: IStateContext = {
  originalSchema: [],
  modifiedSchema: process.env.NODE_ENV === 'development' ? [
    {
      type: 'button',
      uuid: 'bee7c2c5-9343-4ca5-8188-28439ec5695f',
      props: {
        value: 'Button',
        onClick: '_',
        block: false,
      },
      grid: {
        x: 0,
        y: 0,
      },
    },
    {
      type: 'button',
      uuid: 'ca308719-1eb5-4b28-89b2-03a3e7c202c0',
      props: {
        value: 'Button1111',
        onClick: '_',
        block: false,
      },
      grid: {
        x: 0,
        y: 40,
      },
      xProps: {},
    },
  ] as Schema : [],
};

const DefaultDispatchContext: IDispatchContext = {
  importSchema: () => {},
  updateComponentProps: () => {},
  addComponent: () => {},
  dragComponent: () => {},
  deleteComponent: () => {},
};

const StateContext = createContext<IStateContext>(DefaultStateContext);
const DispatchContext = createContext<IDispatchContext>(DefaultDispatchContext);

export {
  StateContext, DispatchContext, DefaultDispatchContext, DefaultStateContext,
  IStateContext, IDispatchContext, Schema, Grid,
};
