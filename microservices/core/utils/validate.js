const responseLib = require("wt-lib").resp;
const validate = (schema) => (req, res, next) => {
  // if (!["body", "query", "params"].includes(path)) {
  //   return next();
  // }
  // const dataForValidation = get(req, path, null);
  // let { value, error } = schema.validate(dataForValidation, { allowUnknown: false, stripUnknown: true });
  // if (error) {
  //   const context = get(error, "details[0].message", null);
  //   const erResponseObj = {
  //     req: req,
  //     result: -1,
  //     message: context,
  //     payload: {},
  //     logPayload: false,
  //   };
  //   return res.status(enums.HTTP_CODES.VALIDATION_ERROR).json(responseLib.createResponseObject(erResponseObj));
  // } else {
  //   // Overriding sanitized object
  //   req[path] = value;
  //   next();
  // }

  const paths = Object.keys(schema);
  if (!paths.length) return next();
  if (
    !paths.includes("body") &&
    !paths.includes("query") &&
    !paths.includes("params") &&
    !paths.includes("files")
  )
    return next();

  for (let path of paths) {
    const dataForValidation = req[path];
    const { value, error } = schema[path].validate(dataForValidation, {
      allowUnknown: false,
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      const context = error?.details;
      return responseLib.BAD_REQUEST({
        res,
        message: `Validation failed for ${path}.`,
        payload: {
          message: context[0]?.message?.replace(/['"]/g, ""),
          fieldsAccepted: Object.keys(schema[path].describe().keys),
        },
      });

      // return responseLib.handleError({
      //   statusCode: 400,
      //   error: `Validation failed for ${path}.`,
      //   payload: {
      //     context,
      //     fieldsAccepted: Object.keys(schema[path].describe().keys),
      //   },
      // }, res);
    }
    req[path] = value;
  }
  next();
};

module.exports = validate;
