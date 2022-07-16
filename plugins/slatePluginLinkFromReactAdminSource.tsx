import { pluginFactories } from '@react-page/plugins-slate';
import { RaSelectReferenceInputField } from '@react-page/react-admin';
import Link from 'next/link';
import React from 'react';
import slate from '@react-page/plugins-slate';

/**
 * This is an example of a slate link plugin that uses react admin to select the target
 */
const PostIdSelector = (props) => (
  // pass the props
  <RaSelectReferenceInputField
    optionText="title"
    reference="posts"
    label="Post"
    {...props} />
);
export const postLinkPlugin = pluginFactories.createComponentPlugin({
  icon: <span>Post</span>,
  type: 'postlink',
  object: 'mark',
  label: 'Post link',
  addHoverButton: true,
  addToolbarButton: true,
  controls: {
    type: 'autoform',
    schema: {
      required: ['postId'],
      type: 'object',
      properties: {
        postId: {
          type: 'string',
          uniforms: {
            // you should lazy load this
            component: PostIdSelector,
          },
        },
      },
    },
  },
  // this code here lives primarly in your frontend, you would create the link however you like
  // and you would probably read more data from your datasource
  // this is just a simple example. The link dofes actually not work in our example, but you should get the idea
  Component: (props: any) => (
    <Link href={'/posts/' + props.postId}>
      <a>{props.children}</a>
    </Link>
  ),
});


// let's add a custom slate plugin
export const customSlate = slate((def) => ({
  ...def,
  plugins: {
    ...def.plugins,
    link: {
      ...def.plugins.link,
      postLink: postLinkPlugin,
    },
  },
}));

