const fs = require('fs');
const path = require('path');

const skillsPath = path.join(__dirname, '../temp/skills.json');

exports.get = () => new Promise(async (resolve, reject) => {
  try {
    let skills = [];
    if (fs.existsSync(skillsPath)) {
      skills = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));
    }
    resolve(skills);
  } catch (err) {
    reject(new Error(err));
  }
});

exports.edit = ({ age, concerts, cities, years }) => new Promise(async (resolve, reject) => {
  try {
    let newSkills = [];
    newSkills.push({
      'number': age,
      'text': 'Возраст начала занятий на скрипке'
    },
    {
      'number': concerts,
      'text': 'Концертов отыграл'
    },
    {
      'number': cities,
      'text': 'Максимальное число городов в туре'
    },
    {
      'number': years,
      'text': 'Лет на сцене в качестве скрипача'
    });

    fs.writeFileSync(path.join(process.cwd(), '/temp/skills.json'), JSON.stringify(newSkills));

    resolve(true);
  } catch (err) {
    reject(new Error(err));
  }
});
