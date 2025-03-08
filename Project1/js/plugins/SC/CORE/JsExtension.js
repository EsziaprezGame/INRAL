//-----------------------------------------------------------------------------
/**
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 *
 * @class JsExtensions
 */
function JsExtensions() {
    throw new Error('This is not a class');
}
//--> JS Extender
String.prototype.removeAccents      = function(){
    return this
      .normalize("NFD") // Normalise la chaîne en utilisant la forme de décomposition normalisée (NFD)
      .replace(/[\u0300-\u036f]/g, ""); // Remplace les caractères diacritiques par une chaîne vide
};
String.prototype.firstToUpper       = function(){
    if (this.length === 0)
      return this;
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.camelToSnake       = function(){
    let res = this.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (res.startsWith('_')) res = res.slice(1);
    return res.replace(/s_c/g, "SimCraft");
}
/** String -> format
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args The objects to format
 * @return {String} A formatted string
 */
String.prototype.format             = function(){
    var args = arguments;
    return this.replace(/%([0-9]+)/g, function(s, n) {
        if(Array.isArray(args[0]))
            return args[0][Number(n) - 1];
        else
            return args[Number(n) - 1];
    });
};
Number.prototype.getCloser          =function(target, range){
    let res = this;

    if(!range && range != 0)
        range = 1;

    if(target > this){
        res += range;
    }else{
        res -= range;
    }

    return res.clamp(this, target);
}
/**
 * Generates a random integer in a range with negative or not option.
 *
 * @static
 * @prototype Math.alea(range, egative)
 * @param {Number} range The upper/lower boundary (default 1)
 * @param {Number} negative return can be negative or not (default false)
 * @return {Number} A random integer
 */
Math.alea = function(range = 1, negative = false){
    let val = Math.round(Math.random() * range);
    let dir = Math.round(Math.random());

    if(negative && dir !=0) return -val;
    else return val;
}
/**
 * Return a random elem of an array.
 *
 * @return {Any} A random element of the Array
 */
Array.prototype.randomElem = function(){
    return this[Math.floor(Math.random() * this.length)]
}
/**
 * Same like forEach but form right elem to left
 *
 * @param {Function} callback called each iteration
 */
Array.prototype.reverseForEach = function(callback, thisArg) {
    this.clone().reverse().forEach(function(value, index, array) {
        callback.call(thisArg, value, index, array);
    });
};