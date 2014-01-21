Package.describe({
  summary: "CAS support for accounts"
});

Package.on_use(function(api) {
  api.use('routepolicy', 'server');
  api.use('webapp', 'server');
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('underscore');

  Npm.depends({cas: "0.0.3"});

  api.add_files('cas_client.js', 'client');
  api.add_files('cas_server.js', 'server');
});