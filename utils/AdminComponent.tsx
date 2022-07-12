import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Resource, Admin } from 'react-admin';
import { products } from '../datatypes/product';
import { pages } from '../datatypes/page';
import { dataProvider, authProvider } from "./provider";

const dynamicResources = async (permissions) => {
  console.log(permissions);
  const user = await authProvider.checkAuth();
  console.log(user);
  // in the future, we can calculate the current project here!
  // in firebase, under /projects/{projectid} -> users: [u1, u2, u3] is an allow-list function
  // resource def could be users/${projectid}/pages, if user is in project
  return [
    <Resource name={`users/${user.uid}/pages`} options={{label: "pages"}} {...pages} />,
    <Resource name={`users/${user.uid}/products`} options={{label: "product"}} {...products} />
  ];
}
 
// 

export default function AdminComponent() {

  return <Admin
    title="Example Admin"
    dataProvider={dataProvider}
    authProvider={authProvider}
    //loginPage={LoginPage}
    requireAuth
  >
    {dynamicResources}
  </Admin>;
}
