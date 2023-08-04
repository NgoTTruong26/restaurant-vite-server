import Joi, { ref } from "joi";
import {
  validateRequireMessage,
  validateRequireType,
} from "../utils/getValidateMessage ";

class UserValidation {
  createUser = {
    body: Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .label("Tên đăng nhập")
        .required()
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
          "string.min": "{{#label}} phải nhiều hơn {{#limit}} kí tự",
          "string.max": "{{#label}} phải ít hơn {{#limit}} kí tự",
        }),
      firstName: Joi.string()
        .label("Tên người dùng")
        .required()
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      lastName: Joi.string()
        .label("Họ người dùng")
        .required()
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      reqPassword: Joi.string()
        .min(3)
        .max(30)
        .label("Mật khẩu")
        .required()
        .messages({
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
          "string.min": "{{#label}} phải nhiều hơn {{#limit}} kí tự",
          "string.max": "{{#label}} phải ít hơn {{#limit}} kí tự",
        }),
      repeatPassword: Joi.any()
        .valid(ref("reqPassword"))
        .required()
        .error(new Error("Mật khẩu không khớp")),
      age: Joi.number()
        .label("Tuổi")
        .messages({
          "number.base": `{{#label}} ${validateRequireType()}`,
          "number.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      email: Joi.string()
        .label("Email")
        .messages({
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      phone: Joi.string()
        .label("Số điện thoại")
        .messages({
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
    }),
  };

  updateUser = {
    body: Joi.object({
      id: Joi.string()
        .label("ID người dùng")
        .required()
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
        }),
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .label("Tên đăng nhập")
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
          "string.min": "{{#label}} phải nhiều hơn {{#limit}} kí tự",
          "string.max": "{{#label}} phải ít hơn {{#limit}} kí tự",
        }),
      firstName: Joi.string()
        .label("Tên người dùng")
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      lastName: Joi.string()
        .label("Họ người dùng")
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      reqPassword: Joi.string()
        .min(3)
        .max(30)
        .label("Mật khẩu")
        .messages({
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
          "string.min": "{{#label}} phải nhiều hơn {{#limit}} kí tự",
          "string.max": "{{#label}} phải ít hơn {{#limit}} kí tự",
        }),
      repeatPassword: Joi.any()
        .valid(ref("password"))
        .error(new Error("Mật khẩu không khớp")),
      age: Joi.number()
        .label("Tuổi")
        .messages({
          "number.base": `{{#label}} ${validateRequireType()}`,
          "number.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      email: Joi.string()
        .label("Email")
        .messages({
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      phone: Joi.string()
        .label("Số điện thoại")
        .messages({
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
    }),
  };

  deleteUser = {
    body: Joi.object({
      userId: Joi.string()
        .label("ID người dùng")
        .required()
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
        }),
    }),
  };
}

export default UserValidation;
