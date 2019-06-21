const productsDb = require('../db/products.js');
const skillsDb = require('../db/skills.js');

module.exports.get = async (ctx) => {
  try {
    const msgemail = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgemail : null;
    const products = await productsDb.get();
    const skills = await skillsDb.get();
    ctx.render('index', {
      products, skills, msgemail
    });
  } catch (err) {
    const status = 500;
    ctx.status = status;
    ctx.render('error', { status, message: err });
  }
};

module.exports.post = async (ctx) => {
  try {
    const msgemail = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgemail : null;
    const products = await productsDb.get();
    const skills = await skillsDb.get();
    const { name, email, message } = ctx.request.body;
    if (!name || !email) {
      ctx.flash.set({ msgemail: 'All fields are required' });
      const status = 400;
      ctx.status = status;
      ctx.redirect('/');
      return;
    }
    // пока просто выведем в консоль
    console.log(name, email, message);
    ctx.render('index', {
      products, skills, msgemail
    });
  } catch (err) {
    const status = 500;
    ctx.status = status;
    ctx.render('error', { status, message: err });
  }
};
