import { RaReactPageInput } from '@react-page/react-admin';
import React, { useState, useEffect } from 'react';
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  List, ShowButton,
  SimpleForm,
  TextField,
  TextInput
} from 'react-admin';
import { useGetIdentity } from 'react-admin';
import { ourCellPlugins } from '../pages/reactadmin';


const PageList = (props: any) => {
  //const { identity, isLoading: identityLoading } = useGetIdentity();
  //const { email, init } = useGetEmail();
  //if(!init) { return null };
  //console.log("!!!!!", email)
  return (
    <>
      {/*!identityLoading && JSON.stringify(identity, null, "  ")*/}
      <List {...props}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <EditButton />
          <ShowButton />
        </Datagrid>
      </List>
    </>
  );
};

export const PageEdit = (props: any) => (
  <Edit title="Edit a Page" {...props}>
    <SimpleForm label="summary">
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <RaReactPageInput
        source="content"
        label="Content"
        cellPlugins={ourCellPlugins} />
    </SimpleForm>
  </Edit>
);

export const PageCreate = (props: any) => (
  <Create title="Create a Page" {...props}>
    <SimpleForm label="summary">
      <TextInput source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Create>
);
export const pages = {
  list: PageList,
  create: PageCreate,
  edit: PageEdit,
};
