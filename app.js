const Koa = require('koa');
const app = new Koa();
require('./db');
require('./engine');

const Pug = require('koa-pug');
const pug = new Pug({
  viewPath: './views/pages',
  basedir: './views',
  pretty: true,
  noCache: true,
  app: app
});

const koastatic = require('koa-static');
app.use(koastatic('./public'));

const session = require('koa-session');
app.use(session({
  key: 'koa:sess',
  maxAge: 'session',
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: false
}, app));

// catch 404 and forward to error handler
app.use(async (ctx, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  await next(err);
});

// error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.render('error', { status: err.status, message: err.message });
  }
});
app.use(async (ctx, next) => {
  if (ctx.path.indexOf('/admin') !== -1) {
    if (!ctx.session.isAuth) {
      ctx.redirect('/login');
    } else {
      await next();
    }
  } else {
    await next();
  }
});
const flash = require('koa-flash-simple');
app.use(flash());

const koaBody = require('koa-body');
app.use(koaBody({
  formidable: {
    uploadDir: './public/assets/img/products/'
  },
  multipart: true
}));

const router = require('./router');
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on localhost:3000');
});
