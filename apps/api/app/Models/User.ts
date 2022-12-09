import { DateTime } from 'luxon'
import { column, BaseModel, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import DiscordToken from 'App/Models/DiscordToken'

export enum Roles {
  user = 'USER',
  gameMaster = 'GAME_MASTER',
  admin = 'ADMIN',
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public discordId: string

  @column()
  public username: string

  @column()
  public avatarUrl: string

  @column()
  public role: Roles

  @hasOne(() => DiscordToken)
  public token: HasOne<typeof DiscordToken>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
