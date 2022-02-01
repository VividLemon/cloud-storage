import { DataTypes, Model, ModelAttributes, Optional } from 'sequelize'

export interface TokenInterface {
  id: number,
  token: string,
}

interface TokenCreationAttributes extends Optional<TokenInterface, 'id'> {}

/**
 * @class
 * @classdesc Builds a token model
 * @extends Model
 * @augments TokenInterface
 * @augments TokenCreationAttributes
 */
export class Token extends Model<TokenInterface, TokenCreationAttributes> implements TokenInterface {
	declare id: number
	declare token: string
	declare readonly createdAt: Date
	declare readonly updatedAt: Date
	static definition: ModelAttributes = {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
}
