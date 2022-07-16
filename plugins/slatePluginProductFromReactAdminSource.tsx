import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography
} from '@mui/material';
import { Record as RecordType } from 'ra-core';
import { CellPlugin } from '@react-page/editor';
import { RaSelectReferenceInputField } from '@react-page/react-admin';
import React, { useEffect, useState } from 'react';
import { dataProvider } from '../utils/dataProvider';

const ProductIdSelector = (props) => (
  // pass the props
  <RaSelectReferenceInputField
    {...props}
    optionText="title"
    reference="products"
    label="Product" />
);
const ProductTeaser = ({ productId }) => {
  // this component would live in your frontend
  // you won't load data from admin here, but from the public frontend api
  // for this example, we use the dataprovider, but in real-live-applications, that would not be the case
  const [product, setProduct] = useState<RecordType | null>(null);
  useEffect(() => {
    dataProvider
      .getOne('products', { id: productId })
      .then((r) => setProduct(r.data));
  }, [productId]);
  return product ? (
    <Card>
      <CardMedia
        image={product.imageUrl}
        title={product.title}
        style={{ height: 240 }} />
      <CardHeader title={product.title} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.teaserText}
        </Typography>
      </CardContent>
    </Card>
  ) : null;
};
export const recommendedProducts = {
  id: 'recommendedProducts',
  title: 'Recommended Products',
  Renderer: (props) => (
    <div>
      <h3>{props.data.title}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
        }}
      >
        {props.data.productIds?.map((id) => (
          <ProductTeaser productId={id} key={id} />
        ))}
      </div>
    </div>
  ),
  version: 1,
  controls: {
    type: 'autoform',
    columnCount: 1,
    schema: {
      required: ['title', 'productIds'],
      properties: {
        title: {
          type: 'string',
          default: 'Our recommended products',
        },
        productIds: {
          type: 'array',
          items: {
            type: 'string',
            uniforms: {
              component: ProductIdSelector,
            },
          },
        },
      },
    },
  },
};
