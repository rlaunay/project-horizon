import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DiscordToken from 'App/Models/DiscordToken'
import User from 'App/Models/User'

export default class DiscordController {
  public async redirect({ ally, auth, response }: HttpContextContract) {
    if (await auth.check()) {
      return response.notAcceptable()
    }

    return response.send({ url: await ally.use('discord').stateless().redirectUrl() })
  }

  public async callback({ ally, auth, response }: HttpContextContract) {
    /**
     * If user is alrady logged in, do not execute the callback.
     */
    if (await auth.check()) {
      return response.notAcceptable()
    }

    const provider = ally.use('discord').stateless()
    /**
     * User has explicitly denied the login request.
     */
    if (provider.accessDenied()) {
      return 'Access was denied'
    }

    /**
     * There was an unknown error during the redirect.
     */
    if (provider.hasError()) {
      return provider.getError()
    }

    const token = await provider.accessToken()
    const { id, email, name, avatarUrl } = await provider.userFromToken(token.token)

    /**
     * Insert the user in database if it doesn't exist,
     * otherwise we return it. We are also storing the access token,
     * so we cas use it later for other operations.
     */
    const user = await User.updateOrCreate(
      {
        discordId: id,
      },
      {
        email: email || undefined,
        username: name,
        avatarUrl: avatarUrl || undefined,
      }
    )

    await DiscordToken.updateOrCreate(
      {
        userId: user.id,
      },
      {
        token: token.token,
        type: token.type,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
        expiresIn: token.expiresIn,
      }
    )

    const oat = await auth.use('api').login(user, {
      expiresIn: '7days',
    })

    /**
     * Create a cookie where the Opaque Access Token
     * will be stored with maxAge = 7 days.
     */

    /**
     * Everything is OK!
     */
    return response.ok({ token: oat.token })
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').logout()
    return { message: 'logged out' }
  }
}
