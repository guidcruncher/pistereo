import {
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import {
  Body,
  Session,
  Post,
  Get,
  Query,
  Res,
  Controller,
} from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import * as dto from '../dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(AuthController.name);

  @Public()
  @Get()
  @ApiOperation({ summary: 'Authenticate on Spotify' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Spotify Authentication flow.',
  })
  @ApiQuery({
    name: 'redirect_uri',
    type: String,
    required: false,
    default: '',
  })
  @ApiQuery({ name: 'state', type: String, required: false, default: '' })
  async getAuthorisationUrl(
    @Session() session,
    @Query('redirect_uri') redirectUrl: string,
    @Query('state') state: string,
    @Res() res,
  ) {
    const clientId = this.config.get('spotify.clientid');
    const authUrl: dto.AuthorisationUrl =
      await this.authService.getAuthorisationUrl(
        clientId,
        state ?? '',
        redirectUrl ?? this.config.get('host.baseurl') + '/api/auth/redirect',
      );
    session.set('verifier', authUrl.state);
    res.status(302).redirect(authUrl.url);
  }

  @Public()
  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Refreshed access token.' })
  async getRefreshToken(@Session() session) {
    const clientId = this.config.get('spotify.clientid');
    const refreshToken = session.get('refresh_token');
    const result = await this.authService.getRefreshToken(
      clientId,
      refreshToken,
    );

    session.set('access_token', result.access_token);
    session.set('refresh_token', result.refresh_token);
    return result;
  }

  @Public()
  @Get('redirect')
  @ApiOperation({ summary: 'Get Access token' })
  @ApiResponse({ status: 200, description: 'Access token and refresh token..' })
  async postAuthRedirect(@Session() session, @Query('code') code: string) {
    const clientId = this.config.get('spotify.clientid');
    const clientSecret = this.config.get('spotify.clientsecret');
    const verifier = session.get('verifier');

    if (!code) {
      throw new UnauthorizedException();
    }

    const result = await this.authService.getAccessToken(
      clientId,
      clientSecret,
      code,
      verifier,
    );

    session
      .set('access_token', result.access_token)
      .session.set('refresh_token', result.refresh_token);
    return result;
  }

  @Public()
  @Post('token')
  @ApiOperation({ summary: 'Get Access token' })
  @ApiResponse({ status: 200, description: 'Access token and refresh token..' })
  async getAccessToken(
    @Session() session,
    @Body() formData: dto.oAuthResponse,
    @Res() res,
  ) {
    const clientId = this.config.get('spotify.clientid');
    const clientSecret = this.config.get('spotify.clientsecret');
    const verifier = session.get('verifier');

    if (!formData.code) {
      throw new UnauthorizedException();
    }

    const result = await this.authService.getAccessToken(
      formData.client_id,
      formData.client_secret,
      formData.code,
      verifier,
      formData.grant_type,
      formData.redirect_uri,
    );

    session.set('access_token', result.access_token);
    session.set('refresh_token', result.refresh_token);
    res.status(200).send(result);
  }
}
