function requireAll(r) { r.keys().forEach(r); }

import './styles/index.pcss'

if (process.env.NODE_ENV !== 'production') {
   requireAll(require.context('./', true, /\.pug$/));
   requireAll(require.context('./', true, /\.images$/));
}


requireAll(require.context('./js', true, /\.js$/));
