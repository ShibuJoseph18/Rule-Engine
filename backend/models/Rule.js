import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rule = sequelize.define('Rule', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rule_ast: {
    type: DataTypes.JSONB,  // Store the AST as JSON
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Rule;
