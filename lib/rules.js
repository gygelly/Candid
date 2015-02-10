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

var empties = []
actionsArray.forEach(function (action) {
  empties.push({})
});

Rules = _.object(actionsArray, empties)  //the rules library

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
    throw new Error('CanDo: "' + action + ":" + subject + '" is not a valid')
  }

  if (!Rules[action][subjectName]) {
    Rules[action][subjectName] = Rules[action][subjectName] || []
    if (action === 'http')
      Rules['get'][subjectName] = Rules['get'][subjectName] || []
      Rules['post'][subjectName] = Rules['post'][subjectName] || []  
      Rules['put'][subjectName] = Rules['put'][subjectName] || []
      Rules['delete'][subjectName] = Rules['delete'][subjectName] || []
    }
    if (action === 'db') {
      Rules['insert'][subjectName] = Rules['insert'][subjectName] || []
      Rules['read'][subjectName] = Rules['read'][subjectName] || []  
      Rules['update'][subjectName] = Rules['update'][subjectName] || []
      Rules['remove'][subjectName] = Rules['remove'][subjectName] || []
    }
  var rule = {
    condition: condition,
    user: user
  };
  if (action === 'http') {
    Rules['http'][subjectName].push(rule)
    Rules['get'][subjectName].push(rule)
    Rules['post'][subjectName].push(rule)
    Rules['put'][subjectName].push(rule)
    Rules['delete'][subjectName].push(rule)
  } else if (action === 'db') {
    Rules['db'][subjectName].push(rule)
    Rules['insert'][subjectName].push(rule)
    Rules['read'][subjectName].push(rule)
    Rules['update'][subjectName].push(rule)
    Rules['remove'][subjectName].push(rule)
  } else {
    Rules[action][subjectName].push(rule)
  }
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