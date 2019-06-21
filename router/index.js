const Router = require('koa-router');
const router = new Router();

const ctrlHome = require('../controllers/home.js');
const ctrlAdmin = require('../controllers/admin.js');
const ctrlLogin = require('../controllers/login.js');
router.get('/', ctrlHome.get);
router.post('/', ctrlHome.post);
router.get('/admin', ctrlAdmin.get);
router.post('/admin/upload', ctrlAdmin.postAddProduct);
router.post('/admin/skills', ctrlAdmin.postEditSkills);
router.get('/login', ctrlLogin.get);
router.post('/login', ctrlLogin.post);

module.exports = router;
