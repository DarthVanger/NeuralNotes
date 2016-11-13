/**
 * Add 'finally' method to javascript native Promise.
 * src: http://stackoverflow.com/a/35999141
 */
Promise.prototype.finally = function(cb) {
    const res = () => this;
    const fin = () => Promise.resolve(cb()).then(res);
    return this.then(fin, fin);
};
