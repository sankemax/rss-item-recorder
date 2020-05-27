module.exports = function tryCatch(fn) {
    return async function withFn(...args) {
        if (fn.constructor.name === "AsyncFunction") {
            return await fn(...args)
                .then(ans => ({ ans }))
                .catch(error => ({ error }));
        }

        try {
            return Promise.resolve({ ans: fn(...args) });
        } catch (error) {
            return Promise.resolve({ error });
        }
    }
}
