Rule = {
  new: function (rules, active, action, subject, conditions) {
    var self = this;
    if (!rules[subject]) {
      rules[subject] = {};
    }
    rules[subject][action] = function () {
      var result = true

      if (active) {
        return result
      } else {
        return !result
      }
    }
  }
}