import { RaReactPageInput } from '../components/RaReactPageInput';
import React, { useState, useEffect } from 'react';
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  List, ShowButton,
  SimpleForm,
  TextField,
  TextInput,
  ReferenceInput,
  SelectInput,
  ReferenceField
} from 'react-admin';
import { createTheme } from '@mui/material/styles';
import { useRecordContext, useGetOne } from "react-admin";

import { ourCellPlugins } from '../pages/reactadmin';
import { useUid } from "../utils/UidContext";


import { red } from '@mui/material/colors';


const PageList = (props: any) => {
  //const { identity, isLoading: identityLoading } = useGetIdentity();
  //const { email, init } = useGetEmail();
  //if(!init) { return null };
  //console.log("!!!!!", email)
  const uid = useUid();
  return (
    <>
      {/*!identityLoading && JSON.stringify(identity, null, "  ")*/}
      <List {...props}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <ReferenceField source="site_id" reference={`users/${uid}/sites`}>
            <TextField source="title" />
          </ReferenceField>
          <EditButton />
          <ShowButton />
        </Datagrid>
      </List>
    </>
  );
};

const RAAdminWrapper = (props) => {
  const uid = useUid();
  const record = useRecordContext();
  const { data, error } = useGetOne(
    `users/${uid}/sites`,
    record?.site_id,
    { enabled: !!record?.site_id }
  );
  const theme = createTheme({
    palette: {
      type: 'dark',
      primary: {
        main: red[500],
      },
    },
    typography: {
      h1: {
        fontSize: '6rem',
      },
    },
    foo: data?.theme, // todo!!
  });
  return (<RaReactPageInput muitheme={theme} {...props} />)
}

export const PageEdit = (props: any) => {
  const uid = useUid();

  return (
    <Edit title="Edit a Page" {...props}>
      <SimpleForm label="summary">
        <>
          <TextInput disabled source="id" />
          <ReferenceInput label="Site" source="site_id" reference={`users/${uid}/sites`}>
              <SelectInput optionText="title" />
          </ReferenceInput>
          <TextInput source="title" />
        </>
        <div style={{minWidth: '80vw', minHeight: '600px'}}>
          <RAAdminWrapper 
            style={{}}
            source="content"
            label="Content"
            cellPlugins={ourCellPlugins} />
        </div>
      </SimpleForm>
    </Edit>
  );
};

export const PageCreate = (props: any) => {
  const uid = useUid();
  return (
    <Create title="Create a Page" {...props}>
      <SimpleForm label="summary">
        <TextInput source="title" />
        <ReferenceInput label="Site" source="site_id" reference={`users/${uid}/sites`}>
              <SelectInput optionText="title" />
          </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
export const pages = {
  list: PageList,
  create: PageCreate,
  edit: PageEdit,
};
