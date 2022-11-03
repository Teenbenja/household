const log4js = require('log4js');
/*
 * Parmeus backend server log configuration.
 * Refer to https://moblab.atlassian.net/wiki/spaces/GSX/pages/147554358/EFK+Stack+Based+Event+Central+Technical+Specification
 */

log4js.configure({
  appenders: {
    stdout: {
      type: 'stdout',
      layout: {
        type: "pattern",
        pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] [%p] [%z] [%c] - %m",
      }
    }
  },
  categories: {
    default: { appenders: ["stdout"], level: 'info' }
  }
});


const logger = log4js.getLogger('HouseholdBackend');

module.exports = logger