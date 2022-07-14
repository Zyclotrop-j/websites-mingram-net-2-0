import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Resource, Admin, useAuthState } from 'react-admin';
import resources from "../datatypes/index";
import { dataProvider, authProvider } from "./provider";
import LoginPage from "../components/LoginPage";
import { Provider } from "../utils/UidContext";

const dynamicResources = async (permissions) => {
  try {
    
    const user = await authProvider.checkAuth(); // might throw
    console.log("user", user);
    // in the future, we can calculate the current project here!
    // in firebase, under /projects/{projectid} -> users: [u1, u2, u3] is an allow-list function
    // resource def could be users/${projectid}/pages, if user is in project
    const res = Object.entries(resources).map(([key, val]) => <Resource name={`users/${user.uid}/${key}`} options={{label: key}} {...Object.fromEntries(Object.entries(val).map(
      ([k, V]) => [k, (props) => <Provider value={user.uid}><V {...props} /></Provider>]
    ))} />);
    return res;
  } catch(e) {
    return [
      <Resource name="public" />
    ];
  }
}
// 

export default function AdminComponent() {

  return <Admin
    title="Example Admin"
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={LoginPage}
    requireAuth
  >
    {dynamicResources}
  </Admin>;
}
