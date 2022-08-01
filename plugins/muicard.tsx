import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { nanoid } from 'nanoid'
import { useUid } from "../utils/UidContext";

import imagePlugin, { makeProdUrl, ImageControls, imageUploadService, defaultTranslations } from './imagePlugin'; 
import { defaultSlate, singleLineSlate } from './slate';
import { cellPlugins } from"./cellPlugins"; 
import gridArea, { withGridArea } from "../utils/gridArea";
import { ColorInput, SpaceInput, SizeInput } from '../utils/themeValueInputs';


/*

<Collapse in={expanded} timeout="auto" unmountOnExit>
  <CardContent>
    ...
  </CardContent>
</Collapse>
*/
const cardHeaderPlugin = {
  Renderer: ({ data }) => <CardHeader
    avatar={data?.category_name ? <Avatar sx={{ bgcolor: data?.category_color }} aria-label={data?.category_aria_label}>
        {data?.category_name}
      </Avatar> : null}
    title={data?.title}
    {...(data.subtitle ? { subheader: data?.subtitle } : {})}
  />,
  id: `muicard-header`,
  title: `Card-header`,
  description: `Header for useage within a Card`,
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        category_name: { type: 'string', default: '' },
        category_color: { "description": "The color of the category", "default": "transparent", "type": "string", ...ColorInput },
        category_aria_label: { type: 'string' },
        title: { type: 'string', default: '' },
        subtitle: { type: 'string', default: '' },
      },
      required: ['title'],
    },
  },
};
const cardActionPlugin = {
  Renderer: ({ data, readOnly }) => <CardActions>
    {(data.buttons || []).map(({title, href, ...props}) => (<Button {...props} size="small" {...(readOnly ? {href} : {})}>
      {title}
    </Button>))}
  </CardActions>,
  id: `muicard-action`,
  title: `Card-action`,
  description: `Action-bar for useage within a Card`,
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        disableSpacing: { type: 'boolean', default: false },
        buttons: {type: 'array', items: {
          type: 'object',
          properties: {
            title: { type: 'string', default: 'text' },
            color: { enum: [
              'primary',
              'secondary',
              'success',
              'error',
              'info',
              'warning',
            ], default: 'primary' },
            disabled: { type: 'boolean', default: false },
            disableRipple: { type: 'boolean', default: false },
            disableTouchRipple: { type: 'boolean', default: false },
            focusRipple: { type: 'boolean', default: false },
            href: { type: 'string', default: '' },
            fullWidth: { type: 'boolean', default: false },
            //endIcon
            //startIcon
            variant: { enum: ['contained', 'outlined', 'text'], default: 'text' },
          },
          required: ['title'],
        }, default: [{
          title: 'Text'
        }]}
      },
      required: [],
    },
  },
};
const cardContentPlugin = {
  Renderer: ({ children }) => <CardContent>
    {children}
  </CardContent>,
  cellPlugins: (plugins) => [
    ...cellPlugins
  ],
  id: `muicard-content`,
  title: `Card-content`,
  description: `Content for useage within a Card`,
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {},
      required: [],
    },
  },
};
const cardMediaPlugin = {
  ...imagePlugin,
  controls: {
    type: 'custom',
    Component: (props) => (
      // todo: add objectift, video-support, height
      <ImageControls
        {...props}
        plain
        imageUpload={imageUploadService}
        translations={defaultTranslations}
      />
    ),
  }, 
  Renderer: (props) => {
    const { data = {} } = props;
    const { height, autoheight, autowidth } = data;
    const uid = useUid();
    const src = uid ? null : makeProdUrl(data?.src);
    const [editSource, setEditSource] = useState<string | undefined>();
    useEffect(() => {
      if(!data?.src) {
        return;
      }
      let cancelled = false;
      (async () => {
        const { getStorage, ref, getDownloadURL } = await import("firebase/storage");
        const refname = data?.src;
        const storage = getStorage();
        const imagesRef = ref(storage, refname);
        if(cancelled) return;
        const lsrc = await getDownloadURL(imagesRef);
        if(cancelled) return;
        setEditSource(lsrc);
      })();
      return () => {
        cancelled = true;
      };
    }, [data?.src])
    const alt = data?.alt;
  
    /*
    object-fit: contain;
    object-fit: cover;
    object-fit: fill;
    object-fit: none;
    object-fit: scale-down;
    revert
    initial
    + allow video
    */
    return (src ?? editSource) ? (
      <CardMedia
        component="img"
        height={autowidth ? undefined : "auto"}
        width={autowidth}
        image={src ?? editSource}
        alt={alt}
        sx={autowidth && autoheight ? {aspectRatio: `${(autowidth/autoheight)}`} : {}}
      />
    ) : (
      <CardMedia
        component="img"
        height={autowidth ? undefined : "194"}
        width={autowidth}
        image={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePbi538ACUYDx/fguDIAAAAASUVORK5CYII="}
        alt="Placeholder"
        sx={autowidth && autoheight ? {aspectRatio: `${(autowidth/autoheight)}`} : {}}
      />
    );
  },
  id: `muicard-media`,
  title: `Card-media`,
  description: `Media for useage within a Card`,
  version: 1
};

const cardActionAreaPlugin = {
  Renderer: ({ data: {href, ...data}, children, readOnly }) => <CardActionArea {...data} {...(readOnly ? {href} : {})}>
    {children}
  </CardActionArea>,
  id: `muicard-cardactionarea`,
  title: `Card-cardactionarea`,
  cellPlugins: () => [
    cardHeaderPlugin,
    cardActionPlugin,
    cardContentPlugin,
    cardMediaPlugin,
  ],
  description: `Link the content (or part of the content) of a Card`,
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        centerRipple: { type: 'boolean', default: false },
        disabled: { type: 'boolean', default: false },
        disableRipple: { type: 'boolean', default: false },
        disableTouchRipple: { type: 'boolean', default: false },
        focusRipple: { type: 'boolean', default: false },
        href: { type: 'string', default: '' },
      },
      required: ['href'],
    },
  },
};

const CardWithGridArea = styled(Card)`
  height: 100%;
  grid-area: ${props => props.gridArea};
`;
const card = {
  Renderer: ({ data, children }) => <CardWithGridArea children={children} {...data} />,
  id: 'muicard',
  title: 'Card',
  description: 'An individual card',
  version: 1,
  cellPlugins: (plugins) => [
    cardActionAreaPlugin,
    cardHeaderPlugin,
    cardActionPlugin,
    cardContentPlugin,
    cardMediaPlugin,
  ],
  /*cellPlugins: (plugins) => plugins,
  createInitialChildren: () => {
    return [
      [
        {
          plugin: defaultSlate,
        }
      ],
    ];
  },*/
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        raised: { type: 'boolean', default: false },
        elevation: { type: 'integer', default: 1, minimum: 0, maximum: 24 },
        square: { type: 'boolean', default: false },
        variant: { enum: ['elevation', 'outlined' ], default: 'elevation' },
        ...gridArea,
      },
      required: [],
    },
  },
};
export default card;
