module.exports = {
  //* common
  GENERAL_ERROR: "Something went wrong",
  SUCCESS: "Success",
  NOT_FOUND: "Not found",
  INTERNAL_SERVER_ERROR: "Internal server error",

  //* middleware
  TOKEN_REQUIRED: "Token required",
  TOKEN_MISSING: "Token missing in header Authorization or x-auth-token",
  TOKEN_EXPIRED: "Token is expired plese try again",
  INVALID_TOKEN: "Invalid token",
  UNAUTHORIZED: "You are not authorized to access this resource",
  INVALID_FIELD: "Invalid field",

  //* role
  ROLE_NOT_FOUND: "Role not found",
  ROLE_ALREADY_EXISTS: "Role already exists",

  //* user
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_PASSWORD: "Invalid password",
  ACCOUNT_DISABLED: "Account is disabled",
  LOGIN_SUCCESS: "Login successfully",
  USER_EMAIL_NOT_REGISTERED: "Email address doesn't register",
  USER_NOT_VERIFIED:
    "Email not verified. Verify via sign-up to continue.",  
  USER_ACCOUNT_NOT_VERIFIED:
    "Please reach out to your administrator to activate your account.",

  //OTP
  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_NOT_FOUND: "OTP not found",
  OTP_ALREADY_VERIFIED: "OTP already verified",
  OTP_NOT_VERIFIED: "Please Enter Valid OTP",

  // * Forgot password
  USER_EMAIL_NOT_FOUND: "Sorry, we could not find an account with that email.",
  USER_PERMISSION_DENIED: "Permission denied, you can't access this account.",
  ADMIN_EMAIL_NOT_FOUND: "You are not allowed to login to this account.",
  OTP_EXPIRED: "OTP has been expired",
  INVALID_OTP: "Invalid OTP",
  TOKEN_ALREADY_USED: "Token already used",

  //Blog
  BLOG_ALREADY_EXISTS: "Slug or Blog title already exists",
  BLOG_ALREADY_SAVED: "Blog already saved by user",
  BLOG_NOT_FOUND: "Blog not found",
  BLOG_SAVED_AS_DRAFT:
    "Your blog content has been successfully saved as a draft.",
  BLOG_SUBMITTED_FOR_APPROVAL: "Your blog has been submitted for approval.",
  BLOG_DELETED: "Blog deleted successfully",
  BLOG_CATEGORY_NOT_FOUND: "Blog category not found",
  BLOG_DRAFT_NOT_ALLOWED: "Cannot get drafts",
  BLOG_ADDED_TO_LIBRARY: "Added to Library",
  BLOG_REMOVED_FROM_LIBRARY: "Removed from Library",
  BLOG_STATUS_ERROR:
    "Initial approval of this blog is required to initiate the trending process.",

  //NewsLetter
  NEWSLETTER_ALREADY_EXISTS: "Email already subscribed for newsletter",
  NEWSLETTER_NOT_FOUND: "Email not found in newsletter",
  NEWSLETTER_DELETED: "Email deleted from newsletter",
  NEWSLETTER_SUBSCRIBED: "Email subscribed for newsletter",
  NEWSLETTER_UNSUBSCRIBED: "Email unsubscribed from newsletter",

  //Blog Category
  CATEGORY_ALREADY_EXISTS: "Category already exists",
  BLOG_CATEGORY_ALREADY_EXISTS: "Slug or Blog category already exists",

  //Product-category
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_DELETED: "Category deleted successfully",
  CATEGORY_UPDATED: "Category updated successfully",

  //Payment
  PAYMENT_LINK_GENERATED: "Payment link generated successfully",


  // Tone Messages
  TONE_ADDED: "Tone added successfully",
  TONE_UPDATED: "Tone updated successfully",
  TONE_DELETED: "Tone deleted successfully",
  TONE_NOT_FOUND: "Tone not found",
  TONE_ALREADY_EXISTS: "Tone already exists",
};
