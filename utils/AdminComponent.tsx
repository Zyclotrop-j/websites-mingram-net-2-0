import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Resource, Admin } from 'react-admin';
import { products } from '../datatypes/product';
import { pages } from '../datatypes/page';
import { dataProvider, authProvider } from "./provider";

const useGetEmail = () => {
  const [state, setState] = useState({ init: false });
  useEffect(() => {
    authProvider.checkAuth().then(i => setState({ i, init: true, email: i.email, uid: i.uid })) // -> this has email
  }, []);
  return state;
}
 
// <Resource name="products" {...products} />

export default function AdminComponent() {
  const { email, init, uid, i } = useGetEmail();
  if(!init) { return null };
  console.log(i);
  return <Admin
    title="Example Admin"
    dataProvider={dataProvider}
    authProvider={authProvider}
    //loginPage={LoginPage}
    //requireAuth
  >
    <Resource name={`users/${uid}/pages`} options={{label: "pages"}} {...pages} />
  </Admin>;
}
