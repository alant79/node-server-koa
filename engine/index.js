const ee = require('@nauma/eventemitter');
const joi = require('joi');
const fs = require('fs');
const path = require('path');
const ENGINE = new ee.EventEmitter('engine');
global.ENGINE = ENGINE;
var DATABASE = global.DATABASE;

ENGINE.on('admin/get', async response => {
  const ctx = response.data;
  const msgskill = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgskill : null;
  const msgfile = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgfile : null;
  response.reply({ msgskill, msgfile });
});

ENGINE.on('admin/skills', async response => {
  let ctx = response.data;
  const schema = joi.object().keys({
    age: joi
      .string()
      .required(),
    concerts: joi
      .string()
      .required(),
    cities: joi
      .string()
      .required(),
    years: joi
      .string()
      .required()
  });
  joi.validate(ctx.request.body, schema, (err, { age, concerts, cities, years }) => {
    if (err) {
      const errMessage = 'Не заполнены все необходиме данные';
      const status = 400;
      ctx.flash.set({ msgskill: errMessage });
      ctx.status = status;
      return response.replyErr({
        message: errMessage,
        status: status
      });
    }
    DATABASE.emit('skills/post', ctx.request.body).then(() => response.reply(true));
  });
});

ENGINE.on('admin/upload', async response => {
  let ctx = response.data;
  const { name, price } = ctx.request.body;
  const { photo } = ctx.request.files;
  const { name: photoName, size, path: tempPath } = photo;
  const uploadDir = path.join(process.cwd(), '/public', 'assets', 'img', 'products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  let err, status;
  if (!name || !price) {
    err = 'All fields are required';
    fs.unlinkSync(tempPath);
    ctx.flash.set({ msgfile: err });
    status = 400;
    ctx.status = status;
    return response.replyErr({
      message: err,
      status: status
    });
  }
  if (!photoName || !size) {
    err = 'File not saved';
    fs.unlinkSync(tempPath);
    ctx.flash.set({ msgfile: err });
    status = 400;
    ctx.status = status;
    return response.replyErr({
      message: err,
      status: status
    });
  }
  fs.renameSync(tempPath, path.join(uploadDir, photoName));
  DATABASE.emit('products/post', { name, price, photoName }).then(() => response.reply(true));
});

ENGINE.on('home/get', async response => {
  let ctx = response.data;
  const msgemail = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgemail : null;
  const products = await DATABASE.emit('products/get');
  const skills = await DATABASE.emit('skills/get');
  response.reply({ products, skills, msgemail });
});

ENGINE.on('home/post', async response => {
  let ctx = response.data;
  const msgemail = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgemail : null;
  const products = await DATABASE.emit('products/get');
  const skills = await DATABASE.emit('skills/get');
  const { message } = ctx.request.body;
  const schema = joi.object().keys({
    name: joi
      .string()
      .required(),
    email: joi
      .string()
      .required(),
    message: joi
      .string()
      .required(false)
  });
  joi.validate(ctx.request.body, schema, (err, { name, email }) => {
    if (err) {
      const errMessage = 'Не заполнены все необходиме данные';
      const status = 400;
      ctx.flash.set({ msgemail: errMessage });
      ctx.status = status;
      return response.replyErr({
        message: errMessage,
        status: status
      });
    }
    console.log(name, email, message);
    response.reply({ products, skills, msgemail });
  });
});

ENGINE.on('login/post', async response => {
  let ctx = response.data;
  const schema = joi.object().keys({
    email: joi
      .string()
      .required()
      .equal('admin@admin.com'),
    password: joi
      .string()
      .required()
      .equal('admin')
  });

  joi.validate(ctx.request.body, schema, (err, { email, password }) => {
    if (err) {
      const errMessage = 'Неправильно заполнены данные';
      const status = 400;
      ctx.flash.set({ msgslogin: errMessage });
      ctx.status = status;
      return response.replyErr({
        message: errMessage,
        status: status
      });
    }
    ctx.session.isAuth = true;
    response.reply(true);
  });
});

ENGINE.on('login/get', async response => {
  const ctx = response.data;
  const msgslogin = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgslogin : null;
  response.reply(msgslogin);
});
