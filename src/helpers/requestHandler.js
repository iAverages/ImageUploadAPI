const format = (res, status = 200, message, data) => {
    // Construct the return json
    const json = { success: status < 400 };
    if (message) json.message = message;
    if (data) json.data = data;

    res.status(status).json(json);
};

const success = (res, message = "", data) => {
    format(res, 200, message, data);
};

const error = (res, message = "", data) => {
    format(res, 500, message, data);
};

const badRequest = (res, message = "", data) => {
    format(res, 400, message, data);
};

const notFound = (res, message = "404 Not Found", data) => {
    format(res, 404, message, data);
};

module.exports = {
    success,
    error,
    badRequest,
    notFound,
};
