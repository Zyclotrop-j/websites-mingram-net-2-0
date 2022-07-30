import { Button } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useIntervalWhen } from "rooks";
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
  BooleanInput,
  NumberInput,
  SelectInput,
} from 'react-admin';
import Box from '@mui/material/Box';
import { get } from "lodash";
import { ColorField, ColorInput } from '../utils/react-color-picker';
import { useAuthProvider } from 'react-admin';
import { useFormState } from 'react-final-form';

import { useUid } from "../utils/UidContext"

const SiteList = (props: any) => {
  const uid = useUid();

  /*
          
  */
  return (
    <>
      <List {...props}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [buildState, setBuildState] = useState({});
  useIntervalWhen(
    async () => {
      const user = await authProvider.checkAuth();
      const token = await user.getIdToken(false);
      const es = await fetch("https://build-websites.mingram.net/progress", { // automatically scoped to the current user via token
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await es.json();
        setBuildState(json);
        if(!Object.keys(json).length) { // done, build-request has been deleted from server as it's done 
          setIsPublishing(false)
        }
    },
    1000 * 5, // run callback every 5 second
    isPublishing, // start the timer when it's true
    false // no need to wait for the first interval
  );
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
    setIsPublishing(true);
  }, [record.id]);
  
  const buildprogress = Object.values(buildState).map(i => i.map(({data}) => data)).flat(2).map(i => i.split("\n").map(q => q.trim())).flat();
  return <>
    <pre>{!buildprogress.length ? "" : JSON.stringify(buildprogress, null, "\t")}</pre>
    <Button disabled={isPublishing} onClick={publish}>Publish</Button>
  </>;
};

const fontStyleChoices = [
  { id: 'normal', name: 'Normal' },
  { id: 'italic', name: 'Italic' },
  { id: 'oblique', name: 'Oblique' },
];


const textTransformChoices = [
  { id: 'none', name: 'none' },
  { id: 'capitalize', name: 'capitalize' },
  { id: 'uppercase', name: 'uppercase' },
  { id: 'lowercase', name: 'lowercase' },
  { id: 'full-width', name: 'full-widt' },
  { id: 'full-size-kana', name: 'full-size-kana' }
];

const DColorInput = props => {
  const { values } = useFormState();
  return (
    <Box sx={{position: 'relative', paddingLeft: 1, borderLeftWidth: 15, borderLeftStyle: 'solid', borderColor: get(values, props.source, 'transparent') }}>
      <ColorInput parse={i => i?.toLowerCase()} {...props} picker={values.advanced ? "Photoshop" : "Slider"} />
    </Box>
  );
};
const AdvancedInput = ({ Component, ...props }) => {
  const { values } = useFormState();
  if(!values.advanced) return null;
  return <Component {...props} />;
}
const AdvancedColorInput = props => {
  const { values } = useFormState();
  if(!values.advanced) return null;
  return (
    <Box sx={{position: 'relative', paddingLeft: 1, borderLeftWidth: 15, borderLeftStyle: 'solid', borderColor: get(values, props.source, 'transparent') }}>
      <ColorInput {...props} parse={i => i?.toLowerCase()} picker={"Photoshop"} />
    </Box>
  );
};
export const SiteEdit = (props: any) => {
  const uid = useUid();
  return (<Edit title="Edit a Site" {...props}>
    <SimpleForm label="summary">
      <TextInput disabled source="id" />
      <TextInput source="title" />
      {/* see http://casesandberg.github.io/react-color/ Photoshop */}
      <DColorInput label="Primary color" source="theme.palette.primary.main" />
      <DColorInput label="Secondary color" source="theme.palette.secondary.main" />
      <NumberInput label="Font scaling color" source="responsiveFontSizes.factor" helperText="Scales font-size for mobile and desktop" initialValue={2} min={1} max={3} step={0.1} />
      {/* responsiveFontSizes -> factor */}
      <NumberInput label="Base font-size" source="theme.fontSize" helperText="Base size of text. Defaults to 14px" initialValue={14} min={7} max={28} step={1} />
      <NumberInput label="Whitespace" source="theme.spacing" helperText="The desired amount of space. Defaults to 100%" initialValue={100} min={10} max={400} step={10} format={f => Math.floor(f * 100 / 8)} parse={v => 8 * parseInt(v) / 100} />
      
      <BooleanInput label="Use advanced theme properties" source="advanced" />

      {/* TODO: on advanced off, delete all advanced keys when themeing, so the props are auto-calculated instead and not overwritten by still-existing advanced props! */}

      <AdvancedInput Component={NumberInput} label="Base font-size" source="theme.htmlFontSize" helperText="Adjust the browser base-fontsize. Defaults to 16px" initialValue={16} min={8} max={32} step={1} />
      
      <AdvancedColorInput label="Info color" initialValue="#0288d1" source="theme.palette.info.main" />
      <AdvancedColorInput label="Success color" initialValue="#2e7d32" source="theme.palette.success.main" />
      <AdvancedColorInput label="Warning color" initialValue="#ed6c02" source="theme.palette.warning.main" />
      <AdvancedColorInput label="Error color" initialValue="#d32f2f" source="theme.palette.error.main" />

      <AdvancedInput Component={NumberInput} label="h1 font size overwrite" source="theme.typography.h1.fontSize" min={4} max={120} step={1} />
      <AdvancedInput Component={NumberInput} label="h2 font size overwrite" source="theme.typography.fontSize" min={4} max={120} step={1} />
      <AdvancedInput Component={NumberInput} label="h3 font size overwrite" source="theme.typography.fontSize" min={4} max={120} step={1} />
      <AdvancedInput Component={NumberInput} label="h4 font size overwrite" source="theme.typography.fontSize" min={4} max={120} step={1} />
      <AdvancedInput Component={NumberInput} label="h5 font size overwrite" source="theme.typography.fontSize" min={4} max={120} step={1} />
      <AdvancedInput Component={NumberInput} label="h6 font size overwrite" source="theme.typography.fontSize" min={4} max={120} step={1} />
      <AdvancedInput Component={NumberInput} label="body1 font size overwrite" source="theme.typography.fontSize" min={4} max={120} step={1} />
      <AdvancedInput Component={NumberInput} label="body2 font size overwrite" source="theme.typography.fontSize" min={4} max={120} step={1} />

      <AdvancedInput Component={NumberInput} label="h1 font weight" initialValue={400} source="theme.typography.h1.fontWeight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="h2 font weight" initialValue={400} source="theme.typography.h2.fontWeight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="h3 font weight" initialValue={400} source="theme.typography.h3.fontWeight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="h4 font weight" initialValue={400} source="theme.typography.h4.fontWeight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="h5 font weight" initialValue={400} source="theme.typography.h5.fontWeight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="h6 font weight" initialValue={400} source="theme.typography.h6.fontWeight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="body1 font weight" initialValue={400} source="theme.typography.body1.fontWeight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="body2 font weight" initialValue={400} source="theme.typography.body2.fontWeight" min={50} max={1000} step={50} />

      <AdvancedInput Component={SelectInput} label="Is h1 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.h1.fontStyle" choices={fontStyleChoices} />
      <AdvancedInput Component={SelectInput} label="Is h2 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.h2.fontStyle" choices={fontStyleChoices} />
      <AdvancedInput Component={SelectInput} label="Is h3 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.h3.fontStyle" choices={fontStyleChoices} />
      <AdvancedInput Component={SelectInput} label="Is h4 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.h4.fontStyle" choices={fontStyleChoices} />
      <AdvancedInput Component={SelectInput} label="Is h5 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.h5.fontStyle" choices={fontStyleChoices} />
      <AdvancedInput Component={SelectInput} label="Is h6 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.h6.fontStyle" choices={fontStyleChoices} />
      <AdvancedInput Component={SelectInput} label="Is body1 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.body1.fontStyle" choices={fontStyleChoices} />
      <AdvancedInput Component={SelectInput} label="Is body2 italic?" initialValue={fontStyleChoices[0].id} source="theme.typography.body2.fontStyle" choices={fontStyleChoices} />
      
      <AdvancedInput Component={SelectInput} label="Transform h1?" initialValue={textTransformChoices[0].id} source="theme.typography.h1.textTransform" choices={textTransformChoices} />
      <AdvancedInput Component={SelectInput} label="Transform h2?" initialValue={textTransformChoices[0].id} source="theme.typography.h2.textTransform" choices={textTransformChoices} />
      <AdvancedInput Component={SelectInput} label="Transform h3?" initialValue={textTransformChoices[0].id} source="theme.typography.h3.textTransform" choices={textTransformChoices} />
      <AdvancedInput Component={SelectInput} label="Transform h4?" initialValue={textTransformChoices[0].id} source="theme.typography.h4.textTransform" choices={textTransformChoices} />
      <AdvancedInput Component={SelectInput} label="Transform h5?" initialValue={textTransformChoices[0].id} source="theme.typography.h5.textTransform" choices={textTransformChoices} />
      <AdvancedInput Component={SelectInput} label="Transform h6?" initialValue={textTransformChoices[0].id} source="theme.typography.h6.textTransform" choices={textTransformChoices} />
      <AdvancedInput Component={SelectInput} label="Transform body1?" initialValue={textTransformChoices[0].id} source="theme.typography.body1.textTransform" choices={textTransformChoices} />
      <AdvancedInput Component={SelectInput} label="Transform body2?" initialValue={textTransformChoices[0].id} source="theme.typography.body2.textTransform" choices={textTransformChoices} />
      

      <AdvancedInput Component={NumberInput} label="shortest transition (150ms)" initialValue={150} source="theme.transitions.duration.shortest" min={0} max={500} step={25} />
      <AdvancedInput Component={NumberInput} label="shorter transition (200ms)" initialValue={200} source="theme.transitions.duration.shorter" min={0} max={500} step={25} />
      <AdvancedInput Component={NumberInput} label="short transition (250ms)" initialValue={250} source="theme.transitions.duration.short" min={0} max={500} step={25} />
      <AdvancedInput Component={NumberInput} label="standard transition (300ms)" initialValue={300} source="theme.transitions.duration.standard" min={0} max={500} step={25} />
      <AdvancedInput Component={NumberInput} label="complex transition (375ms)" initialValue={375} source="theme.transitions.duration.complex" min={0} max={500} step={25} />
      <AdvancedInput Component={NumberInput} label="enteringScreen transition (225ms)" initialValue={225} source="theme.transitions.duration.enteringScreen" min={0} max={500} step={25} />
      <AdvancedInput Component={NumberInput} label="leavingScreen transition (195ms)" initialValue={195} source="theme.transitions.duration.leavingScreen" min={0} max={500} step={25} />

      <AdvancedInput Component={SelectInput} label="Default text direction" initialValue={'ltr'} source="theme.direction" choices={[{id:'ltr', name:'Left-to-right (ltr)'}, {id:'rtl', name:'Right-to-left (rtl)'}]} />
      
      <AdvancedInput Component={NumberInput} label="Global border-radius. Defaults to 4px" initialValue={4} source="theme.shape.borderRadius" min={0} max={50} step={1} />

      <AdvancedInput Component={NumberInput} label="Light font weight (300)" initialValue={300} source="theme.typography.fontWeightLight" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="Regular font weight (400)" initialValue={400} source="theme.typography.fontWeightRegular" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="Medium font weight (500)" initialValue={500} source="theme.typography.fontWeightMedium" min={50} max={1000} step={50} />
      <AdvancedInput Component={NumberInput} label="Bold font weight (700)" initialValue={700} source="theme.typography.fontWeightBold" min={50} max={1000} step={50} />
      
      <TextInput source="theme.name" />

      
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
