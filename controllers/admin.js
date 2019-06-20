const productsDb = require('../db/products.js');
const skillsDb = require('../db/skills.js');
const fs = require('fs');
const path = require('path');

module.exports.get = async (ctx) => {
  try {
    const msgskill = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgskill : null;
    const msgfile = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgfile : null;
    ctx.render('admin', { msgskill, msgfile });
  } catch (err) {
    ctx.render('error', { status: ctx.status, message: err });
  }
};

module.exports.postEditSkills = async (ctx) => {
  try {
    const { age, concerts, cities, years } = ctx.request.body;
    if (!age || !concerts || !cities || !years) {
      const err = 'All fields are required';
      console.log(err);
      ctx.flash.set({ msgskill: err });
      ctx.redirect('/admin');
      return;
    }
    await skillsDb.edit({ ...ctx.request.body });
    ctx.render('admin');
  } catch (err) {
    ctx.render('error', { status: ctx.status, message: err });
  }
};

module.exports.postAddProduct = async ctx => {
  try {
    console.log(ctx.request.body, ctx.request.files);
    const { name, price } = ctx.request.body;
    const { photo } = ctx.request.files;
    const { name: photoName, size, path: tempPath } = photo;
    const uploadDir = path.join(process.cwd(), '/public', 'assets', 'img', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    let err;
    if (!name || !price) {
      err = 'All fields are required';
      fs.unlinkSync(tempPath);
      ctx.flash.set({ msgfile: err });
      ctx.redirect('/admin');
      return;
    }
    if (!photoName || !size) {
      err = 'File not saved';
      fs.unlinkSync(tempPath);
      ctx.flash.set({ msgfile: err });
      ctx.redirect('/admin');
      return;
    }
    fs.renameSync(tempPath, path.join(uploadDir, photoName));
    await productsDb.add({ photoName, name, price });
    ctx.render('admin');
  } catch (err) {
    ctx.render('error', { status: ctx.status, message: err });
  }
};
