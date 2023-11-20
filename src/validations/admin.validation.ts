import Joi, { ref } from 'joi';
import {
  validateRequireMessage,
  validateRequireType,
} from '../utils/getValidateMessage ';
import { IArrayRoleDTO } from '../modules/admin/dto/admin.dto';

class AdminValidation {
  createAdmin = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .label('Tên đăng nhập')
      .required()
      .messages({
        'any.required': `{{#label}} ${validateRequireMessage()}`,
        'string.empty': `{{#label}} ${validateRequireMessage()}`,
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
        'string.min': '{{#label}} phải nhiều hơn {{#limit}} kí tự',
        'string.max': '{{#label}} phải ít hơn {{#limit}} kí tự',
      }),
    password: Joi.string()
      .min(3)
      .max(30)
      .label('Mật khẩu')
      .required()
      .messages({
        'string.empty': `{{#label}} ${validateRequireMessage()}`,
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
        'string.min': '{{#label}} phải nhiều hơn {{#limit}} kí tự',
        'string.max': '{{#label}} phải ít hơn {{#limit}} kí tự',
      }),
    repeat_password: Joi.any()
      .valid(ref('password'))
      .required()
      .error(new Error('Mật khẩu không khớp')),
    fullName: Joi.string()
      .label('Họ & Tên người dùng')
      .required()
      .messages({
        'any.required': `{{#label}} ${validateRequireMessage()}`,
        'string.empty': `{{#label}} ${validateRequireMessage()}`,
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
      }),
    dateBirth: Joi.date()
      .label('Ngày sinh')
      .messages({
        'date.base': `{{#label}} ${validateRequireType()}`,
        'date.alphanum': `{{#label}} ${validateRequireType()}`,
      }),
    gender: Joi.string()
      .allow(null)
      .label('Giới tính')
      .messages({
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
      }),
    nationality: Joi.string()
      .label('Quốc tịch')
      .messages({
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
      }),
    email: Joi.string()
      .label('Email')
      .allow('')
      .messages({
        'string.empty': `{{#label}} ${validateRequireMessage()}`,
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
      }),
    phoneNumber: Joi.string()
      .label('Số điện thoại')
      .allow(null)
      .messages({
        'string.empty': `{{#label}} ${validateRequireMessage()}`,
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
      }),
    roles: Joi.array<IArrayRoleDTO>()
      .label('Chức vụ')
      .allow(null)
      .messages({
        'array.base': `{{#label}} ${validateRequireType()}`,
      }),
  });

  creatSetMenu = Joi.object({
    setName: Joi.string()
      .alphanum()
      .label('Tên set buffet')
      .required()
      .messages({
        'any.required': `{{#label}} ${validateRequireMessage()}`,
        'string.empty': `{{#label}} ${validateRequireMessage()}`,
        'string.base': `{{#label}} ${validateRequireType()}`,
        'string.alphanum': `{{#label}} ${validateRequireType()}`,
      }),
    image: Joi.string()
      .label('Tên set buffet')
      .required()
      .messages({
        'any.required': `{{#label}} ${validateRequireMessage()}`,
        'string.empty': `{{#label}} ${validateRequireMessage()}`,
        'string.base': `{{#label}} ${validateRequireType()}`,
      }),
  });
}

export default AdminValidation;
