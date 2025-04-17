import {
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
  ApiOAuth2,
} from '@nestjs/swagger';
import {
  Body,
  Session,
  Get,
  Param,
  Put,
  Post,
  Query,
  Res,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { TuneinService } from './tunein.service';
import { Public, Private } from '@auth/public.decorator';
import { SearchRequest } from './models';
import { User } from '@auth/auth-token.decorator';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/tunein')
export class TuneinController {
  constructor(private readonly tuneinService: TuneinService) {}
}
