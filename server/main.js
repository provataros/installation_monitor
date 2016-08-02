import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Accounts.config({
   loginExpirationInDays: null
  })
});
