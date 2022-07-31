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
  ReferenceField,
  SimpleFormIterator,
  ArrayInput,
  AutocompleteArrayInput
} from 'react-admin';
import { ThemeOptions } from '@mui/material/styles';
import { useRecordContext, useGetOne } from "react-admin";

import { ourCellPlugins } from '../pages/reactadmin';
import { useUid } from "../utils/UidContext";


import { red } from '@mui/material/colors';
import { createTheme } from '../utils/createTheme';

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
  const theme = createTheme(data);
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
          <TextInput source="description" multiline />
          <TextInput source="excerpt" multiline />
          <TextInput source="url" />
          
          <TextInput source="menu.title" />
          <TextInput source="menu.icon" />
          <AutocompleteArrayInput source="tags" choices={[
              { id: 'programming', name: 'Programming' },
              { id: 'lifestyle', name: 'Lifestyle' },
              { id: 'photography', name: 'Photography' },
          ]} />
          

          <TextInput source="twitter.image" />
          <TextInput source="twitter.title" />
          <TextInput source="twitter.description" multiline />
          <TextInput source="facebook.image" />
          <TextInput source="facebook.title" />
          <TextInput source="facebook.description" multiline />
          
          Heide Geburtstag
        </>
        <div style={{minWidth: '80vw'}}>
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

