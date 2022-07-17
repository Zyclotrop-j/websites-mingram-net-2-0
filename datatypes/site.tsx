import { Button } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  List, ShowButton,
  SimpleForm,
  TextField,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceManyField,
  useRecordContext,
} from 'react-admin';
import { useAuthProvider } from 'react-admin';
import { useUid } from "../utils/UidContext"

const SiteList = (props: any) => {
  //const { identity, isLoading: identityLoading } = useGetIdentity();
  //const { email, init } = useGetEmail();
  //if(!init) { return null };
  //console.log("!!!!!", email)

  const uid = useUid();
  return (
    <>
      <List {...props}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="theme" />
          <ReferenceManyField label="Pages" source="id" reference={`users/${uid}/pages`} target="site_id">
            <Datagrid>
              <TextField source="id" />
              <TextField source="title" />
              <TextField source="site_id" />
            </Datagrid>
          </ReferenceManyField>
          <EditButton />
          <ShowButton />
        </Datagrid>
      </List>
    </>
  );
};

const PublishButton = () => {
  
  const authProvider = useAuthProvider();
  const record = useRecordContext();
  const publish = useCallback(async () => {
    const user = await authProvider.checkAuth();
    const token = await user.getIdToken(false);
    console.log(record);
    const rawresponse = await fetch('https://build-websites.mingram.net/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ site: record.id }),
    });
    const jsonresponse = await rawresponse.json();
    console.log(jsonresponse);
  }, [record.id]);
  return <Button onClick={publish}>Publish</Button>;
};

export const SiteEdit = (props: any) => {
  const uid = useUid();
  return (<Edit title="Edit a Site" {...props}>
    <SimpleForm label="summary">
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <TextInput source="theme" />
      <ReferenceManyField label="Pages" reference={`users/${uid}/pages`} target="site_id">
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
        </Datagrid>
      </ReferenceManyField>
      <PublishButton />
    </SimpleForm>
  </Edit>);
};

/*
<ReferenceArrayInput source="pages" reference="pages">
          <SelectArrayInput optionText="page" />
      </ReferenceArrayInput>
*/

export const SiteCreate = (props: any) => (
  <Create title="Create a Site" {...props}>
    <SimpleForm label="summary">
      <TextInput source="title" />
      <TextInput source="theme" />
    </SimpleForm>
  </Create>
);
export const sites = {
  list: SiteList,
  create: SiteCreate,
  edit: SiteEdit,
};
