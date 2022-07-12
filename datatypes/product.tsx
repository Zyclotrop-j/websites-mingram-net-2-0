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

const ProductList = (props: any) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <ImageField source="imageUrl" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const ProductEdit = (props: any) => (
  <Edit title="Edit a Product" {...props}>
    <SimpleForm label="summary">
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <TextInput multiline source="teaserText" />
      <TextInput source="imageUrl" />
    </SimpleForm>
  </Edit>
);

export const ProductCreate = (props: any) => (
  <Create title="Create a Product" {...props}>
    <SimpleForm label="summary">
      <TextInput source="id" />
      <TextInput source="title" />
      <TextInput multiline source="teaserText" />
      <TextInput source="imageUrl" />
    </SimpleForm>
  </Create>
);
export const products = {
  list: ProductList,
  create: ProductCreate,
  edit: ProductEdit,
};
