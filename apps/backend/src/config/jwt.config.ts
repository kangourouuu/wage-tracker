
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'supersecret',
  accessExp: process.env.JWT_ACCESS_EXP || '15m',
  refreshExp: process.env.JWT_REFRESH_EXP || '30d',
}));
