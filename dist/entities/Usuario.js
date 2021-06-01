"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
exports.Usuario = void 0;
var typeorm_1 = require("typeorm");
var Clase_1 = require("./Clase");
var Valoracion_1 = require("./Valoracion");
var Inscripcion_1 = require("./Inscripcion");
var Usuario = /** @class */ (function (_super) {
    __extends(Usuario, _super);
    function Usuario() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Usuario.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true }),
        __metadata("design:type", String)
    ], Usuario.prototype, "email");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Usuario.prototype, "contrasenia");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Usuario.prototype, "nombre");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Usuario.prototype, "apellido");
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Usuario.prototype, "creditos");
    __decorate([
        typeorm_1.OneToMany(function () { return Clase_1.Clase; }, function (clase) { return clase.profesor; }),
        __metadata("design:type", Array)
    ], Usuario.prototype, "clases");
    __decorate([
        typeorm_1.OneToMany(function () { return Valoracion_1.Valoracion; }, function (valoracion) { return valoracion.valorado; }),
        __metadata("design:type", Array)
    ], Usuario.prototype, "valoraciones");
    __decorate([
        typeorm_1.OneToMany(function () { return Valoracion_1.Valoracion; }, function (valoracion) { return valoracion.valorador; }),
        __metadata("design:type", Array)
    ], Usuario.prototype, "historial_valoraciones");
    __decorate([
        typeorm_1.OneToMany(function () { return Inscripcion_1.Inscripcion; }, function (inscripcion) { return inscripcion.usuario; }),
        __metadata("design:type", Array)
    ], Usuario.prototype, "inscripciones");
    Usuario = __decorate([
        typeorm_1.Entity('usuarios')
    ], Usuario);
    return Usuario;
}(typeorm_1.BaseEntity));
exports.Usuario = Usuario;
