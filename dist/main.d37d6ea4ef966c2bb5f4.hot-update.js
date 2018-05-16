exports.id = "main";
exports.modules = {

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst app_controller_1 = __webpack_require__(/*! ./app.controller */ \"./src/app.controller.ts\");\r\nconst app_service_1 = __webpack_require__(/*! ./app.service */ \"./src/app.service.ts\");\r\nconst todos_controller_1 = __webpack_require__(/*! ./todos/todos.controller */ \"./src/todos/todos.controller.ts\");\r\nconst todos_service_1 = __webpack_require__(/*! ./todos/todos.service */ \"./src/todos/todos.service.ts\");\r\nlet AppModule = class AppModule {\r\n};\r\nAppModule = __decorate([\r\n    common_1.Module({\r\n        imports: [],\r\n        controllers: [\r\n            app_controller_1.AppController,\r\n            todos_controller_1.TodosController\r\n        ],\r\n        providers: [\r\n            app_service_1.AppService,\r\n            todos_service_1.TodosService\r\n        ]\r\n    })\r\n], AppModule);\r\nexports.AppModule = AppModule;\r\n\n\n//# sourceURL=webpack:///./src/app.module.ts?");

/***/ }),

/***/ "./src/todos/todos.controller.ts":
/*!***************************************!*\
  !*** ./src/todos/todos.controller.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst todos_service_1 = __webpack_require__(/*! ./todos.service */ \"./src/todos/todos.service.ts\");\r\nconst rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\r\nlet TodosController = class TodosController {\r\n    constructor(todosService) {\r\n        this.todosService = todosService;\r\n    }\r\n    getAll() {\r\n        return this.todosService.getAll();\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Get(),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", rxjs_1.Observable)\r\n], TodosController.prototype, \"getAll\", null);\r\nTodosController = __decorate([\r\n    common_1.Controller('todos'),\r\n    __metadata(\"design:paramtypes\", [todos_service_1.TodosService])\r\n], TodosController);\r\nexports.TodosController = TodosController;\r\n\n\n//# sourceURL=webpack:///./src/todos/todos.controller.ts?");

/***/ }),

/***/ "./src/todos/todos.service.ts":
/*!************************************!*\
  !*** ./src/todos/todos.service.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\r\nlet TodosService = class TodosService {\r\n    constructor() {\r\n    }\r\n    getAll() {\r\n        return rxjs_1.of(this.createDummyTodos());\r\n    }\r\n    createDummyTodos() {\r\n        return [\r\n            {\r\n                id: '1',\r\n                name: 'List 1'\r\n            },\r\n            {\r\n                id: '2',\r\n                name: 'List 2'\r\n            },\r\n            {\r\n                id: '3',\r\n                name: 'List 3'\r\n            }\r\n        ];\r\n    }\r\n};\r\nTodosService = __decorate([\r\n    common_1.Injectable(),\r\n    __metadata(\"design:paramtypes\", [])\r\n], TodosService);\r\nexports.TodosService = TodosService;\r\n\n\n//# sourceURL=webpack:///./src/todos/todos.service.ts?");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"rxjs\");\n\n//# sourceURL=webpack:///external_%22rxjs%22?");

/***/ })

};