import { Neogma, ModelFactory } from 'neogma'
import { config } from '../config/env'
import { neoRelations, UserProperties } from './types'

const neogma = new Neogma(
  {
    url: config.NEO4J_URL,
    username: config.NEO4J_USER,
    password: config.NEO4J_PASSWORD,
  },
  {
    logger: console.log,
  }
)

type UserRelationships = {
  friends: never
}

const User = ModelFactory<UserProperties, UserRelationships>(
  {
    label: 'User',
    schema: {
      userId: { type: 'number', required: true },
      email: { type: 'string', required: true },
    },
    primaryKeyField: 'userId',
  },
  neogma
);

User.addRelationships({
  friends: {
    model: User,
    direction: 'out',
    name: neoRelations.friends,
    properties: {},
  },
})

export { neogma, User }