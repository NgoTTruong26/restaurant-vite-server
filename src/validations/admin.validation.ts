import Joi from "joi";
import {
  validateRequireMessage,
  validateRequireType,
} from "../utils/getValidateMessage ";

class AdminValidation {
  creatSetMenu = {
    body: Joi.object({
      setName: Joi.string()
        .alphanum()
        .label("Tên set buffet")
        .required()
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
          "string.alphanum": `{{#label}} ${validateRequireType()}`,
        }),
      image: Joi.string()
        .label("Tên set buffet")
        .required()
        .messages({
          "any.required": `{{#label}} ${validateRequireMessage()}`,
          "string.empty": `{{#label}} ${validateRequireMessage()}`,
          "string.base": `{{#label}} ${validateRequireType()}`,
        }),
    }),
  };
}

export default AdminValidation;
