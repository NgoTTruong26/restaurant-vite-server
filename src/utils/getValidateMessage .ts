const enum ValidateMessage {
  REQUIRED = "không được để trống",
  REQUIRED_TYPE = "kiểu kí tự nhập không hợp lệ",
  REQUIRED_ACCEPT = "Vui lòng chấp nhập",
  INVALID = "không hợp lệ",
  NOT_MATCH = "không khớp",
}

export function validateRequireAccept() {
  return ValidateMessage.REQUIRED_ACCEPT;
}

export function validateRequireMessage() {
  return ValidateMessage.REQUIRED;
}

export function validateInvalidMessage() {
  return ValidateMessage.INVALID;
}

export function validateNotMatchMessage() {
  return ValidateMessage.NOT_MATCH;
}

export function validateRequireType() {
  return ValidateMessage.REQUIRED_TYPE;
}
