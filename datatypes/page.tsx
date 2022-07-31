import { RaReactPageInput } from '../components/RaReactPageInput';
import React, { useState } from 'react';
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  List,
  SimpleForm,
  TextField,
  TextInput,
  ReferenceInput,
  SelectInput,
  ReferenceField,
  AutocompleteArrayInput,
  ReferenceArrayInput,
  ShowButton,
} from 'react-admin';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography  from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useRecordContext, useGetOne } from "react-admin";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '@mui/material/Link';
import TuneIcon from '@mui/icons-material/Tune';

import { ourCellPlugins } from '../pages/reactadmin';
import { useUid } from "../utils/UidContext";


import { red } from '@mui/material/colors';
import { createTheme } from '../utils/createTheme';
import { CustomSimpleForm } from './customizations/CustomSimpleForm';

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
};

const PathDisplay = () => {
  const uid = useUid();
  const record = useRecordContext();
  const { data, error } = useGetOne(
    `users/${uid}/sites`,
    record?.site_id,
    { enabled: !!record?.site_id }
  );
  const domain = `${data?.id || '...'}-d.mingram.net`;
  return (<Breadcrumbs
    separator={<NavigateNextIcon fontSize="small" />}
    aria-label="breadcrumb"
  >
    <Typography color="text.primary">
      <Link underline="hover" color="inherit" href={`https://${domain}`}>
        {domain}
      </Link>
    </Typography>
    <Typography color="text.primary">
      <Link underline="hover" color="inherit" href={`https://${domain}/${record.title}`} >
        {record.title}
      </Link>
    </Typography>
  </Breadcrumbs>);
}

export const PageEdit = (props: any) => {
  const uid = useUid();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Edit {...props} title="Edit a Page" >
      <CustomSimpleForm label="summary">
        <>
          <Grid px={2}  bgcolor="grey.200" container direction="row" justifyContent="space-between" alignItems="center">
            <PathDisplay />
            <Button variant="text" size="large" onClick={toggle} endIcon={<TuneIcon />} >Edit Page Meta-data</Button>
          </Grid>
          <Drawer
            anchor={'right'}
            open={isOpen}
            onClose={close}
          >
            <Box
              sx={{ width: '80vw', padding: 4  }}
              role="presentation"
            >
              <Grid container spacing={2} rowSpacing={1} columnSpacing={2}>
                <Grid item xs={11} md={11}>
                  <Typography variant="h5" component="h2">Name and description</Typography>
                </Grid>
                <Grid item xs={1} md={1} textAlign="end">
                  <IconButton color="primary" aria-label="close" onClick={close}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={2} md={2}>
                  <ReferenceInput label="Site" source="site_id" reference={`users/${uid}/sites`} fullWidth>
                    <SelectInput optionText="title" fullWidth />
                  </ReferenceInput>
                </Grid>
                <Grid item xs={8} md={8}>
                  <TextInput source="title" fullWidth />
                </Grid>
                <Grid item xs={2} md={2}>
                  <TextInput disabled source="id" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput source="description" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput source="excerpt" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography variant="h5" component="h2">Path and representation in-page</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextInput source="url" fullWidth />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextInput source="menu.title" fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="menu.icon" fullWidth />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography variant="h5" component="h2">Meta-data</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextInput source="twitter.image" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextInput source="twitter.title" fullWidth />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <TextInput source="twitter.description" multiline fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextInput source="facebook.image" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextInput source="facebook.title" fullWidth />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <TextInput source="facebook.description" multiline fullWidth />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography variant="h5" component="h2">Tags</Typography>
                </Grid>
                <Grid item xs={12}>
                  <ReferenceArrayInput label="Tags" reference={`users/${uid}/tags`} source="tags" fullWidth>
                      <AutocompleteArrayInput fullWidth />
                  </ReferenceArrayInput>
                </Grid>
              </Grid>
            </Box>
          </Drawer>
        </>
        <div style={{minWidth: '80vw', width: 'auto'}}>
          <RAAdminWrapper 
            style={{}}
            source="content"
            label="Content"
            cellPlugins={ourCellPlugins} />
        </div>
      </CustomSimpleForm>
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

