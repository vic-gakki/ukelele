'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('sheets', {
  	sid: {
  		type: 'int',
  		primaryKey: true,
  		autoIncrement: true
  	},
  	compose: {
  		type: 'string',
  		length: 10000,
  		notNull: true
  	},
    sstatus: {
      type: 'int',
      length: 1,
      defaultValue: 0
    },
  	music_id: {
  		type: 'int',
  		notNull: true,
  		unique: true,
  		foreignKey: {
  			name: 'music_sheets_fk',
  			table: 'music',
  			mapping: 'mid',
  			rules: {
  				onDelete: 'CASCADE',
  				onUpdate: 'RESTRICT'
  			}
  		}
  	}
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
