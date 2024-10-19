// models/Rule.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';  // Sequelize connection setup

const Rule = sequelize.define('Rule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rule_string: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ast_root: {
        type: DataTypes.JSONB,  // Store the AST as JSON
        allowNull: false
    }
}, {
    timestamps: true
});

export default Rule;
