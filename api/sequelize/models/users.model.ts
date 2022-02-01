import { DataTypes, Model, ModelAttributes, Optional } from 'sequelize'
import { hashSync } from 'bcrypt'

export interface UserInterface {
  id: number,
  name: string,
  password: string
}

interface UserCreationAttributes extends Optional<UserInterface, 'id'> {}

/**
 * @class
 * @classdesc Builds a user model
 * @extends Model
 * @augments UserInterface
 * @augments UserCreationAttributes
 */
export class User extends Model<UserInterface, UserCreationAttributes> implements UserInterface {
	declare id: number
	declare name: string
	declare password: string
	declare readonly createdAt: Date
	declare readonly updatedAt: Date
	static definition: ModelAttributes = {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set(value: string) {
				const hash = hashSync(value, 15)
				this.setDataValue('password', hash)
			}
		}
	}
}
