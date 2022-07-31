import { Button } from '@mui/material';
import { useLogout } from 'react-admin';
import React, { useEffect } from 'react';
import {
  Datagrid,
  EditButton,
  List, ShowButton,
  TextField,
  ReferenceManyField,
} from 'react-admin';

const PublicList = (props: any) => {
  const logout = useLogout();
  useEffect(() => {
    logout();
  }, []);
  return (
    <>
      
    </>
  );
};

export const publics = {
  list: PublicList
};
