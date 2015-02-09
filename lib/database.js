//see temp for details

//add functions to Mongo.Collection object instances (e.g. findOne)
idempotentTransform(function (inst) {
  inst.helpers({
    _getCollectionName: function () {
      return inst._name
    }
  })
});