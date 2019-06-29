const Router = require('koa-router');
const router = new Router();
var ENGINE = global.ENGINE;

router.get('/login', async (ctx) => {
  ENGINE.emit('login/get', ctx)
    .then(msgslogin => ctx.render('login', { msgslogin }))
    .catch(error => ctx.render('error', { status: 500, message: error.message }));
});

router.post('/login', async ctx => {
  ENGINE.emit('login/post', ctx)
    .then(() => {
      ctx.redirect('/admin');
    })
    .catch(error => {
      if (error.status && error.status === 400) {
        ctx.redirect('/login');
      } else {
        const status = 500;
        ctx.status = status;
        ctx.render('error', { status, message: error.message });
      }
    });
});

router.get('/admin', async ctx => {
  ENGINE.emit('admin/get', ctx)
    .then(data => ctx.render('admin', { msgskill: data.msgskill, msgfile: data.msgfile }))
    .catch(error => ctx.render('error', { status: 500, message: error.message }));
});

router.get('/', async ctx => {
  ENGINE.emit('home/get', ctx)
    .then(data => ctx.render('index', { products: data.products, skills: data.skills, msgemail: data.msgemail }))
    .catch(error => ctx.render('error', { status: 500, message: error.message }));
});

router.post('/', async ctx => {
  ENGINE.emit('home/post', ctx)
    .then(data => {
      ctx.render('index', { products: data.products, skills: data.skills, msgemail: data.msgemail });
    })
    .catch(error => {
      if (error.status && error.status === 400) {
        ctx.redirect('/');
      } else {
        const status = 500;
        ctx.status = status;
        ctx.render('error', { status, message: error.message });
      }
    });
});

router.post('/admin/skills', async ctx => {
  ENGINE.emit('admin/skills', ctx)
    .then(() => {
      ctx.render('admin');
    })
    .catch(error => {
      if (error.status && error.status === 400) {
        ctx.redirect('/admin');
      } else {
        const status = 500;
        ctx.status = status;
        ctx.render('error', { status, message: error.message });
      }
    });
});

router.post('/admin/upload', async ctx => {
  ENGINE.emit('admin/upload', ctx)
    .then(() => {
      ctx.render('admin');
    })
    .catch(error => {
      if (error.status && error.status === 400) {
        ctx.redirect('/admin');
      } else {
        const status = 500;
        ctx.status = status;
        ctx.render('error', { status, message: error.message });
      }
    });
});

module.exports = router;
