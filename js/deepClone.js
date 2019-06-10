function deepClone (obj) {
  let copy;
  if (obj === null || typeof obj !== 'object' || obj === undefined) return obj;
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepClone(obj[i])
    }
    return obj;
  }
  if (obj instanceof Object) {
    copy = {};
    for(let key in obj) {
      if(obj.hasOwnProperty(attr)) copy[key] = deepClone(obj[key]);
    }
    return obj;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}