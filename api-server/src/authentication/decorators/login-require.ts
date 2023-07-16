import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { ApiBearerAuth } from '@nestjs/swagger';

// export const LoginRequired = applyDecorators(
//   UseGuards(ApiBearerAuth(), AuthGuard('jwt')),
// );
export const LoginRequired = applyDecorators(UseGuards(AuthGuard('jwt')));
