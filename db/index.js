const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
const fs = require('fs');
const path = require('path');
global.DATABASE = DATABASE;

class DB {
  constructor (file) {
    this.file = file;
  }
  _fullnameFile () {
    return path.join(process.cwd(), this.file);
  }
  init (data) {
    fs.writeFileSync(this._fullnameFile(), JSON.stringify(data, '', 4));
  }
  find (type) {
    let data = [];
    if (fs.existsSync(this._fullnameFile())) {
      data = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'))[type];
    }
    return data;
  }
  add (type, data) {
    if (type === 'products') {
      // отработаем только добавление products, для данной задачи skills не нужно
      let currentData = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'));
      const { photoName, name, price } = data;
      let newProducts = currentData[type];
      newProducts.push({
        'src': './assets/img/products/' + photoName,
        'name': name,
        'price': price
      });
      currentData[type] = newProducts;
      fs.writeFileSync(this._fullnameFile(), JSON.stringify(currentData, '', 4));
    }
  }
  // delete (type, data) {} для данной задачи реализовывать не нужно
  // get (type, data) {} для данной задачи реализовывать не нужно
  update (type, data) {
    if (type === 'skills') {
      // отработаем только редактирование skills, для данной задачи products не нужно
      let currentData = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'));
      const { age, concerts, cities, years } = data;
      let newSkills = [];
      newSkills.push(
        {
          number: age,
          text: 'Возраст начала занятий на скрипке'
        },
        {
          number: concerts,
          text: 'Концертов отыграл'
        },
        {
          number: cities,
          text: 'Максимальное число городов в туре'
        },
        {
          number: years,
          text: 'Лет на сцене в качестве скрипача'
        }
      );
      currentData[type] = newSkills;
      fs.writeFileSync(
        this._fullnameFile(),
        JSON.stringify(currentData, '', 4)
      );
    }
  }
}

const db = new DB('/temp/database.json');
db.init({
  products: [],
  skills: [
    { number: '67', text: 'Возраст начала занятий на скрипке' },
    { number: '45', text: 'Концертов отыграл' },
    { number: '32', text: 'Максимальное число городов в туре' },
    { number: '11', text: 'Лет на сцене в качестве скрипача' }
  ]
});

DATABASE.on('products/get', response => {
  response.reply(db.find('products'));
});

DATABASE.on('skills/get', response => {
  response.reply(db.find('skills'));
});

DATABASE.on('products/post', response => {
  response.reply(db.add('products', response.data));
});

DATABASE.on('skills/post', response => {
  response.reply(db.update('skills', response.data));
});
