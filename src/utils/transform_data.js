function transformData(data) {
    if (Array.isArray(data)) {
      return data.map(item => transformData(item));
    } else if (typeof data === 'object' && data !== null) {
      
      let newObj = {};
      for (const [key, value] of Object.entries(data)) {
        if (key === '_id') {
          newObj['id'] = value;
        } else if (key !== '__v') {
          newObj[key] = transformData(value);
        }
      }
      return newObj;
    }
    return data;
  }
  
  module.exports = transformData;