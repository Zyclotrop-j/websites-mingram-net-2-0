import fakeDataProvider from 'ra-data-fakerest';
import { demo } from '../sampleContents/demo';
import { raAboutUs } from '../sampleContents/raAboutUs';

// this is a fake dataprovider. Normally you woul use your own data-provider (rest, graphql, etc.)
export const dataProvider = fakeDataProvider({
  pages: [
    { id: 'page1', title: 'About us', content: raAboutUs },
    { id: 'page2', title: 'An empty page' },
    { id: 'page3', title: 'Demo!', content: demo },
  ],
  products: [
    {
      id: 'product1',
      title: 'A Fancy Chair!',
      imageUrl: 'https://picsum.photos/seed/react-page/800/600',
      teaserText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    },
    {
      id: 'product2',
      title: 'Some miracelous table',
      imageUrl: 'https://picsum.photos/seed/react-page-is-awesome/800/600',
      teaserText: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    },
    {
      id: 'product3',
      title: 'Fantastic closet',
      imageUrl: 'https://picsum.photos/seed/react-admin-as-well/800/600',
      teaserText: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    },
  ],
});
