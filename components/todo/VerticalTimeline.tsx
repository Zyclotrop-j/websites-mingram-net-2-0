import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazyload';
import { once } from "ramda";
import Observer from '@researchgate/react-intersection-observer';
import { Spinning } from 'grommet-controls';
import { AnnounceContext } from "grommet";
import metadata from "grommet-icons/metadata";
import 'react-vertical-timeline-component/style.min.css';
import { forceCheck } from 'react-lazyload';
import defer from "lodash/defer";

interface Props {

}

export const uiSchema = {
  "layout": {
    "ui:widget": "list",
    "ui:options": {
      "getList": () => ["1-column", "2-columns"]
    }
  },
  "dateformat": {
    "ui:widget": "list",
    "ui:options": {
      "getList": () => ["absolute", "relative", "none"]
    }
  },
  "content": {
    "items": {
      "icon": {
        "ui:widget": "list",
        "ui:options": {
          "getList": () => Object.keys(metadata)
        }
      },
      "color": {
        "ui:widget": "grommet-color"
      },
      "background": {
        "ui:widget": "grommet-color",
      },
      "tagcolor": {
        "ui:widget": "grommet-color",
      }
    }
  }
};

const schema = {
  "title": "componentverticaltimeline",
  "type": "object",
  "properties": {
    "animate": {
      "description": "Play an enter animation",
      "type": "boolean"
    },
    "layout": {
      "description": "One of '1-column', '2-columns'",
      "type": "string"
    },
    "dateformat": {
      "description": "Any of absolute (format date locally), relative (display relativ to today), none (don't apply formatting)",
      "type": "string"
    },
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "content": {
            "type": "string",
            "x-$ref": "componentgroup"
          },
          "tag": {
            "description": "Label the item, most commonly the date. Appears next to the timeline, opposide of the item",
            "type": "string"
          },
          "background": {
            "type": "string",
            "description": "Background of the icon and content"
          },
          "color": {
            "type": "string",
            "description": "Forground of the icon"
          },
          "icon": {
            "type": "string",
            "description": "The icon to use"
          },
          "tagcolor": {
            "type": "string",
            "description": "Color of the tag-text"
          }
        }
      }
    }
  }
};

const importComponent = (cb) => import('./VerticalTimelineComponent').then(c => cb(c.default));
let Timeline;

const Tmp = (props) => {
  const {
    _id,
  } = props;

  // We Wrap the Component to avoid react doing reducer magic
  const [state, setState] = useState("INITIAL");

  const f = event => {
    if(event.isIntersecting && state === "INITIAL") {
      setState("LOADING");
      importComponent(Component => {
        Timeline = Component;
        setState("LOADED");
      })
    }
  };

  if(Timeline) {
    return <AnnounceContext.Consumer>
      {announce => {
        announce(
          "Timeline loaded",
          "polite",
          2000
        );
        defer(forceCheck);
        return <Timeline {...props} />;
      }}
    </AnnounceContext.Consumer>
  }
  return (<Observer root={typeof window !== `undefined` && (document.querySelector(".Pane.horizontal.Pane2") || (q => q[q.length - 1])(document.querySelectorAll(".page-wrap")))} rootMargin="25% 0% 25% 0%" key={_id} onChange={f}>
    <div aria-label="Loading Timeline">
      <Spinning
        id={`loading-${_id}`}
        kind="circle"
        color="currentColor"
        size="medium"
        aria-hidden
      />
    </div>
  </Observer>);
};

//
export const VerticalTimeline = (props) => <Tmp {...props} />;
