const { Schema } = require('mongoose');


 
function tenantPlugin(schema, options = {}) {
  const tenantIdRequired = options.tenantIdRequired !== false; // defaults to true

  schema.add({
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: tenantIdRequired,
      index: true,
    },
  });

  const scopedQueryMiddleware = function (next) {
    const queryOptions = this.getOptions();
    const filter = this.getFilter();

    if (queryOptions.skipTenantScope) {
      return next();
    }

    if (filter.tenantId) {
      return next();
    }

    if (queryOptions.tenantId) {
      this.where({ tenantId: queryOptions.tenantId });
      return next();
    }

    return next(
      new Error(
        `Tenant-scoped query on "${this.model.modelName}" was executed without a tenantId. ` +
          'Pass it via .setOptions({ tenantId }) or explicitly opt out with { skipTenantScope: true } ' +
          '(super-admin/platform-level operations only).'
      )
    );
  };

  ['find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete', 'countDocuments', 'updateMany', 'deleteMany'].forEach(
    (method) => schema.pre(method, scopedQueryMiddleware)
  );

  schema.pre('save', function (next) {
    if (tenantIdRequired && this.isNew && !this.tenantId) {
      return next(new Error(`Cannot save "${this.constructor.modelName}" without a tenantId.`));
    }
    next();
  });
}

module.exports = tenantPlugin;