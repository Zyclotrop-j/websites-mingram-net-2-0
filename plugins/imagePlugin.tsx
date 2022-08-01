
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ImageUpload, useUiTranslator } from '@react-page/editor';
import React, { useCallback, useEffect, useState } from 'react';
import { imagePlugin } from '@react-page/plugins-image';
import { lazyLoad } from '@react-page/editor';
import { useRecordContext } from 'react-admin';
import { nanoid } from 'nanoid'
import { useUid } from "../utils/UidContext";

export const ImageControls = (props) => {
  const { t } = useUiTranslator();
  const record = useRecordContext();
  const onImageUplaod = useCallback(props.imageUpload(record), [record]);
  return (
    <>
      {/* Button and existing image text box */}
      <div style={{ display: 'flex' }}>
        {props.imageUpload && (
          <>
            <ImageUpload
              translations={props.translations}
              imageUpload={onImageUplaod}
              imageUploaded={(image) =>
                props.onChange({
                  src: image.url,
                  autowidth: image.width,
                  autoheight: image.height,
                })
              }
            />
            <Typography variant="body1" style={{ margin: '20px 16px 0 16px' }}>
              {t(props.translations?.or)}
            </Typography>
          </>
        )}
        <TextField
          placeholder={t(props.translations?.srcPlaceholder) ?? ''}
          label={t(
            props.imageUpload
              ? props.translations?.haveUrl
              : props.translations?.imageUrl
          )}
          name="src"
          // style={{ flex: 1 }}
          value={props.data.src ?? ''}
          onChange={(e) =>
            props.onChange({
              src: e.target.value,
            })
          }
        />
      </div>

      <br />

      {/* Image link textbox and checkbox */}
      {!props.plain && <TextField
        placeholder={t(props.translations?.hrefPlaceholder) ?? ''}
        label={t(props.translations?.hrefLabel) ?? ''}
        name="href"
        style={{ width: '400px' }}
        value={props.data.href ?? ''}
        onChange={(e) =>
          props.onChange({
            href: e.target.value,
          })
        }
      />}

      {!props.plain && <FormControlLabel
        control={
          <Checkbox
            checked={props.data.openInNewWindow ?? false}
            onChange={(e) =>
              props.onChange({
                openInNewWindow: e.target.checked,
              })
            }
          />
        }
        label={t(props.translations?.openNewWindow)}
      />}

      {!props.plain && <br />}
      {/* Image's meta like alt... */}
      <TextField
        placeholder={t(props.translations?.altPlaceholder) ?? ''}
        label={t(props.translations?.altLabel) ?? ''}
        name="alt"
        style={{ width: '400px' }}
        value={props.data.alt ?? ''}
        onChange={(e) =>
          props.onChange({
            alt: e.target.value,
          })
        }
      />
    </>
  );
};

const iconStyle = {
  width: '100%',
  height: 'auto',
  padding: '0',
  color: '#aaa',
  textAlign: 'center',
  minWidth: 64,
  minHeight: 64,
  maxHeight: 256,
};
export const makeProdUrl = url => {
  return `/images/${url?.split('/').pop()}`; // get image name
};
const ImageIcon = lazyLoad(() => import('@mui/icons-material/Landscape'));
const ImageHtmlRenderer = (
  props
) => {
  const { data } = props;
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
  const openInNewWindow = data?.openInNewWindow;
  const image = (
    <img className="react-page-plugins-content-image" alt={alt} src={src ?? editSource} />
  );

  return (src ?? editSource) ? (
    <div>
      {data?.href ? (
        <a
          onClick={props.isEditMode ? (e) => e.preventDefault() : undefined}
          href={data?.href}
          target={openInNewWindow ? '_blank' : undefined}
          rel={openInNewWindow ? 'noreferrer noopener' : undefined}
        >
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  ) : (
    <div>
      <div className="react-page-plugins-content-image-placeholder">
        <ImageIcon style={iconStyle} />
      </div>
    </div>
  );
};

export const defaultTranslations = {
  pluginName: 'Image',
  pluginDescription: 'Loads an image from an url.',
  or: 'OR',
  haveUrl: 'Existing image URL',
  imageUrl: 'Image URL',
  hrefPlaceholder: 'http://example.com',
  hrefLabel: 'Link to open upon image click',
  altPlaceholder: "Image's description",
  altLabel: "Image's alternative description",
  openNewWindow: 'Open link in new window',
  srcPlaceholder: 'http://example.com/image.png',

  // Strings used in ImageUpload
  buttonContent: 'Choose for upload',
  noFileError: 'No file selected',
  badExtensionError: 'Wrong file type',
  tooBigError: 'Image file > 5MB',
  uploadingError: 'Error while uploading',
  unknownError: 'Unknown error',
};
export const imageUploadService =
  (record) => {
    return async (file, reportProgress) => {
      const { authProvider } = await import("../utils/provider");
      const user = await authProvider.checkAuth();
      const { getStorage, ref, uploadBytesResumable } = await import("firebase/storage");
      const storage = getStorage();
      const {
        site_id,
        title,
        updatedby,
      } = record;

      const newfilename = nanoid();
      const refname = `images/${user.uid}/${site_id}/${newfilename}`;

      const widthHeightPromise = new Promise<{ width: number, height: number }>((res, rej) => {
        const url = URL.createObjectURL(file);
        const img = new Image;
        img.onload = function() {
            const width = img.width;
            const height = img.height;
            URL.revokeObjectURL(img.src);
            res({ width, height });
        };
        img.onerror = function(e) {
          URL.revokeObjectURL(img.src);
          rej(e);
        }
        img.src = url;
      });
      
      const imagesRef = ref(storage, refname);
      
      const metadata = {
        customMetadata: {
          name: file.name,
          user: user.uid,
          site: site_id,
          lastModified: file.lastModified
        }
      };
      const uploadTask = uploadBytesResumable(imagesRef, file, metadata);
      const url = await new Promise((res, rej) => uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          reportProgress(progress);
          // snapshot.state = 'paused' | 'running'
        }, 
        (error) => {
          console.error(error);
          rej(error);
        }, 
        () => {
          res(refname);
        }
      ));
      const {height, width} = await widthHeightPromise;
      return { url, height, width };
    };
  }

export default {
    ...imagePlugin({}),
    controls: {
      type: 'custom',
      Component: (props) => (
        <ImageControls
          {...props}
          imageUpload={imageUploadService}
          translations={defaultTranslations}
        />
      ),
    }, 
    Renderer: ImageHtmlRenderer
  };

