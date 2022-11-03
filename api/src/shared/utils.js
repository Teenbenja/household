class RouterBuilder {
    constructor () {
        this.routers = [];
    }

    get(url, handler) {
        this.routers.push({
            method: "GET",
            path: url,
            handler: handler,
        });
    }

    post(url, handler) {
        this.routers.push({
            method: "POST",
            path: url,
            handler: handler,
        });
    }

    put(url, handler) {
        this.routers.push({
            method: "PUT",
            path: url,
            handler: handler,
        });
    }

    patch(url, handler) {
        this.routers.push({
            method: "PATCH",
            path: url,
            handler: handler,
        });
    }

    delete(url, handler) {
        this.routers.push({
            method: "DELETE",
            path: url,
            handler: handler,
        });
    }

    build() {
        return this.routers;
    }
}

class ServiceError extends Error {
    constructor (status, message, rawError = undefined) {
        super();
        this.name = 'ServiceError';
        this.status = status;
        this.message = message;
        this.rawError = rawError;
    }
}

// assert certain condition. It will throw InternalError when didn't satisfied the condition
function serviceAssert(cond, status, message, rawError) {
    if (!cond) {
        throw new ServiceError(status, message, rawError);
    }
}

function wrapAsync(fn) {
    return function(req, res, next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next).catch(next);
    };
  }

module.exports = { ServiceError, serviceAssert, RouterBuilder, wrapAsync }