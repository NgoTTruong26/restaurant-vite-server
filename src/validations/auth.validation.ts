import Joi, { ref } from "joi";
import {
  validateRequireMessage,
  validateRequireType,
} from "../utils/getValidateMessage ";

class AuthValidation {
  signIn = {
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
      remember_account: Joi.boolean(),
    }),
  };

  signUp = {
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
      acceptTermsAndServices: Joi.boolean()
        .required()
        .valid(true)
        .messages({
          "any.required": `Vui lòng chấp nhận điều khoản và dịch vụ để đăng kí`,
        })
        .error(
          new Error("Vui lòng chấp nhận điều khoản và dịch vụ để đăng kí")
        ),
    }),
  };
}

export default new AuthValidation();
