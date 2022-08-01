import styled from '@emotion/styled';

export default {
    "gridArea": {
        "description": "The gridArea this is assigned to, if any",
        "default": "",
        "type": "string"
    },
};

export const withGridArea = (component: any) => styled(component)`
    grid-area: ${props => props.gridArea}
`;
