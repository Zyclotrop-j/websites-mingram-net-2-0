import React from 'react';
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  List, ShowButton,
  SimpleForm,
  TextField,
  TextInput,
  ImageField
} from 'react-admin';

const TagList = (props: any) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const TagEdit = (props: any) => (
  <Edit title="Edit a Tag" {...props}>
    <SimpleForm label="summary">
      <TextInput disabled source="id" />
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

export const TagCreate = (props: any) => (
  <Create title="Create a Tag" {...props}>
    <SimpleForm label="summary">
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
export const tags = {
  list: TagList,
  create: TagCreate,
  edit: TagEdit,
};
