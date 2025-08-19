const input = {
  name: {
    firstName: 'ABC',
    lastName: 'XYZ'
  },
  contact: {
    phone: '123-123-1234',
    address: {
      streetNumber: '123',
      streetName: 'Main St',
      postalCode: 'X1Y 2X3'
    }
  },
  score: '100'
};

const dataNeeded = ['name.firstName', 'contact.phone', 'contact.address.streetName', 'contact.faxNumber', 'initials.signature', 'contact.faxNumber.streetName', 'score'];

const output = {
   firstName: 'ABC',
   phone: '123-123-1234',
   streetName: 'Main St',
   score: '100'
}

function parseObj(obj, dataNeeded) {
  const result = dataNeeded.reduce((generatedObj, oneData) => {
    const properties = oneData.split('.');
    let value = obj;
    
    // parse obj with dataNeeded 
    for (let property of properties) {
      if (value && value.hasOwnProperty(property)) {
        value = value[property];
      } else {
        value = undefined;
        break;
      }
    }
    
    // generate new obj
    if (value !== undefined) {
      const lastProperty = properties[properties.length - 1];
      generatedObj[lastProperty] = value;
    }
    
    return generatedObj;
  }, {});
  
  return result;
}

console.log(parseObj(input, dataNeeded));
