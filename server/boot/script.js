module.exports = function (app) {
  var mongoDB = app.dataSources.mongodb_ds;
  mongoDB.autoupdate('Usuario', function (err) {
    if (err) throw (err);
    var Usuario = app.models.Usuario;
    Usuario.find({ where: { username: 'admin' }, limit: 1 }, function (err, users) {
      if (users.length == 0) {
        Usuario.create([
          { username: 'administrador', email: 'admin@admin.com', password: 'pr3gu30b3m', admin: true }
        ], function (err, users) {
          if (err) throw(err);

          var Role = app.models.Role;
          var RoleMapping = app.models.RoleMapping;

          Role.destroyAll();
          RoleMapping.destroyAll();

          //create the admin role
          Role.create({
            name: 'admin'
          }, function (err, role) {
            if (err) throw(err);

            //make admin
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[0].id
            }, function (err, principal) {
              if (err) throw (err);
            });
          });
        })
      }
      else {
      }
    });
  });

};
//MONGODB_URI : mongodb://heroku_70tz7xfz:3r7212b8fr2klejtntqiqbdvbt@ds155315.mlab.com:55315/heroku_70tz7xfz
//{"username":"administrador","password":"pr3gu30b3m"}
