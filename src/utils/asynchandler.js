const asynchandler = (reqhandlerfn) => {
    return (req, res, next) => {
        Promise.resolve(reqhandlerfn(req, res, next))
            .catch((err) => next(err));
    };
}

export { asynchandler };