const Router = require('koa-router');
const router = new Router();

const productsCtrl = require('../controllers/products.js');
const skillsCtrl = require('../controllers/skills.js');
const authCtrl = require('../controllers/auth.js');
const messageCtrl = require('../controllers/message.js');

router.get('/', async (ctx) => {
  try {
    const msgemail = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgemail : null;
    const products = await productsCtrl.get();
    const skills = await skillsCtrl.get();
    ctx.render('index', {
      products, skills, msgemail
    });
  } catch (err) {
    console.error(err.message);
    ctx.status = 404;
  }
});

router.post('/', async (ctx) => {
  try {
    const msgemail = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgemail : null;
    const products = await productsCtrl.get();
    const skills = await skillsCtrl.get();
    await messageCtrl.add({ ...ctx.request.body });
    ctx.render('index', {
      products, skills, msgemail
    });
  } catch (err) {
    console.error(err.message);
    ctx.status = 404;
    ctx.flash.set({ msgemail: err.message });
    ctx.redirect('/');
  }
});

router.get('/admin', async (ctx) => {
  const msgskill = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgskill : null;
  const msgfile = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgfile : null;
  try {
    if (ctx.session.isAuth) {
      ctx.render('admin', { msgskill, msgfile });
    } else {
      ctx.redirect('/login');
    }
  } catch (err) {
    console.error(err.message);
    ctx.status = 404;
  }
});

router.post('/admin/upload', async (ctx) => {
  try {
    await productsCtrl.add({ ...ctx.request.files, ...ctx.request.body });
    ctx.render('admin');
  } catch (err) {
    console.error(err.message);
    ctx.status = 404;
    ctx.flash.set({ msgfile: err.message });
    ctx.redirect('/admin');
  }
});

router.post('/admin/skills', async (ctx) => {
  try {
    await skillsCtrl.edit({ ...ctx.request.body });
    ctx.render('admin');
  } catch (err) {
    console.error(err.message);
    ctx.status = 404;
    ctx.flash.set({ msgskill: err.message });
    ctx.redirect('/admin');
  }
});

router.get('/login', async (ctx) => {
  try {
    const msgslogin = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgslogin : null;
    ctx.render('login', {
      msgslogin
    });
  } catch (err) {
    console.error(err.message);
    ctx.status = 404;
  }
});

router.post('/login', async (ctx) => {
  try {
    await authCtrl.auth(ctx.request.body);
    ctx.session.isAuth = true;
    ctx.redirect('admin');
  } catch (err) {
    console.error(err.message);
    ctx.flash.set({ msgslogin: err.message });
    ctx.redirect('/login');
  }
});
module.exports = router;