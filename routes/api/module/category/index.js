const routerCategory = require('express').Router();
const listCategory = require('../../../../controller/Category/ListCategoryController');
const createCategory = require('../../../../controller/Category/CreateCategoryController');
const DeleteCategory = require('../../../../controller/Category/DeleteCategory');
const editCategory = require('../../../../controller/Category/UpdateCategoryController');
const { default: DetailCategory } = require('../../../../controller/Category/DetailCategory');
routerCategory.get('/list', listCategory);
routerCategory.post('/create', createCategory);
routerCategory.post('/delete', DeleteCategory);
routerCategory.post('/edit', editCategory);
routerCategory.post('/detail', DetailCategory);

module.exports = routerCategory;
