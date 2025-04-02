import { SetMetadata } from '@nestjs/common';

export const PublicKey = 'IsPublicKey';

export const Public = (...args: string[]) => SetMetadata(PublicKey, true);

export const Private = (...args: string[]) => SetMetadata(PublicKey, false);
