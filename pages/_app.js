import 'sanitize.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/reduce-motion.css';
import 'ress';

import '../styles/overwrites.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}
  
export default MyApp