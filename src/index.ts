import express from 'express';
import path from 'path';
import expressHandlebars from 'express-handlebars';

import { downloadFile, renderView } from './controllers/order.controller';

const HOST = 'http://localhost';
const PORT = 4500;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

app.get('/invoices/view', renderView);
app.get('/invoices/download', downloadFile);

app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(PORT, async () => {
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
