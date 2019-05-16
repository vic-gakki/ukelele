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
  return db.createTable('music', {
  	mid: {
  		type: 'int',
  		primaryKey: true,
  		autoIncrement: true
  	},
  	title: {
  		type: 'string',
  		notNull: true
  	},
  	beatNum: {
  		type: 'int',
  		defaultValue: 3
  	},
  	beatMelody: {
  		type: 'int',
  		defaultValue: 4
  	},
  	containerWidth: {
  		type: 'int',
  		defaultValue: 1000
  	},
  	seperatorColor: {
  		type: 'string',
  		defaultValue: 'rgba(0, 0, 0, .6)'
  	},
  	melodyOffset: {
  		type: 'int',
  		defaultValue: 100
  	},
  	assistantHeight: {
  		type: 'int',
  		defaultValue: 30
  	},
  	rowMargin: {
  		type: 'int',
  		defaultValue: 60
  	},
  	mstatus: {
  		type: 'int',
  		length: 1,
  		defaultValue: 0
  	}
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
