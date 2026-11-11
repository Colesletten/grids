import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import '@fontsource/arimo/400.css';
import '@fontsource/arimo/700.css';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/old-standard-tt/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/tinos/400.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
