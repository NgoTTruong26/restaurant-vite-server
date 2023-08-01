enum EUNIQUENAME {
  Admin_username_key = "Admin_username",
  User_username_key = "Username",
  User_email_key = "Email",
  RefreshToken_token_key = "Refresh Token",
  childrenCategoryId = "Trẻ em",
}

export default function getPrismaRequestError(
  code: string,
  uniqueName: keyof typeof EUNIQUENAME
) {
  if (code === "P2002") {
    return EUNIQUENAME[uniqueName] + " " + "đã được sử dụng";
  }

  if (code === "P2003") {
    return EUNIQUENAME[uniqueName] + " " + "không hợp lệ";
  }
}
