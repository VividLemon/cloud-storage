import { join } from 'path'
import { Sequelize } from 'sequelize'
import { User, Token } from './models'

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: join(process.cwd(), 'api', 'sequelize', 'db.sqlite')
})

export const models = {
	User,
	Token
}

for (const value of Object.values(models)) {
	value.init(value.definition, { sequelize })
}

sequelize.sync()
