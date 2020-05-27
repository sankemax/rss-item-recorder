module.exports = function tryCatch(fn) {
    return async function withFn(...args) {
        try {
            const maybePromise = fn(...args);
            if (maybePromise.then && maybePromise.catch) {
                return await maybePromise
                    .then(ans => ({ ans }))
                    .catch(error => ({ error }));

            }
            return Promise.resolve({ ans: maybePromise });
        } catch (error) {
            return Promise.resolve({ error });
        }

    }
}
