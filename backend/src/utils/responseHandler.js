export const successHandler = (
  res,
  successCode,
  successMessage,
  user,
  token,
) => {
  let safeUser = null;
  if (user) {
    const rawUser = user._doc || user;
    const { password, ...rest } = rawUser;
    safeUser = rest;
  }

  const response = {
    success: true,
    error: false,
    message: successMessage,
    successCode,
    user: safeUser,
    token,
  };
  res.status(successCode).json(response);
  return;
};

export const errorHandler = (res, errorCode, errorMessage) => {
  const response = {
    success: false,
    error: true,
    message: errorMessage,
    errorCode,
  };

  res.status(errorCode).json(response);
  return;
};

export const serverError = (res, serverErrorCode, serverErrorMessage) => {
  const errorMessage = serverErrorMessage || "Internal Server Error.";
  const errorCode = serverErrorCode || 500;
  const response = {
    success: false,
    error: true,
    message: errorMessage,
    errorCode,
  };

  res.status(errorCode).json(response);
  return;
};
