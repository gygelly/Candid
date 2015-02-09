UI.registerHelper('can', function (action, subject, conditions) {
  return Can.can(action, subject, conditions)
})

UI.registerHelper('authorized', function (action, subject, conditions) {
  return Can.authorized(action, subject, conditions)
})