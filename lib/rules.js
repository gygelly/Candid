Rules = {} //the rules library

dbArray = [ //database operations
'db',
'insert',
'read',
'update',
'remove'
]

httpArray = [ //http operations
'http',
'get',
'post',
'put',
'delete'
]

actionsArray = _.union(dbArray, httpArray, 'client', 'method');

addRule = function (action, subject, condition, user) {
  var subjectName;

  if (condition && !_.isFunction(condition)) {
    throw new Error('CanDo: condition must be undefined or a function for "' + subject + ':' + action + '"')
  }

  if (user && !_.isFunction(user)) {
    throw new Error('CanDo: user must be undefined or a function for "' + subject + ':' + action + '"')
  }

  if (httpArray.indexOf(action) != -1) {
    subjectName = setHTTP(action, subject)
  }
  if (action == 'client') {
    subjectName = setClient(action, subject)
  }
  if (action == 'method') {
    subjectName = setMethod(action, subject)
  }
  if (dbArray.indexOf(action) != -1) {
    subjectName = setDb(action, subject, condition, user)
  } 

  if (!subjectName) { //no action matched if subjectName not set.
    throw new Error('CanDo: "' + action + '" is not a valid action')
  }

  if (!Rules[subjectName]) {
    Rules[subjectName] = {};
  }

  if (!Rules[subjectName][action]) {
    Rules[subjectName][action] = []
  }
  Rules[subjectName][action].push({
    condition: condition,
    user: user
  })
}

var setHTTP = function (action, subject) {
  if (typeof subject !== 'string') {
    throw new Error('CanDo: Non-String route name given with "' + subject + ':' + action + '"')
  }
  return subject;
  //I:R hook!
}

var setClient = function (action, subject) {
  if (typeof subject !== 'string') {
    throw new Error('CanDo: Non-String route name given with "' + subject + ':' + action + '"')
  }
  return subject;
  //I:R hook! 
}

var setMethod = function (action, subject) {
  if (typeof subject !== 'string') {
    throw new Error('CanDo: Non-String method name given with "' + subject + ':' + action + '"')
  }
  return subject;
  //more via _.wrap hack
}

var setDb = function (action, subject, condition, user) {
  if (!(subject instanceof Mongo.Collection) && !(subject instanceof Meteor.Collection)) {
    throw new Error('CanDo: Non-Collection given with "' + subject + ':' + action + '"')
  }

  //always return the name
  return subject._name;
}