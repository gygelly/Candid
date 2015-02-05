Meteor.call = _.wrap(Meteor.call, function () {
  func = Array.prototype.shift.apply(arguments)
  
  arguments[0]
  
  func.apply(func, arguments)
})