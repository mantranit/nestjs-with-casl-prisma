import { ApiProperty } from '@nestjs/swagger';

export class CountUserStatusEntity {
  @ApiProperty()
  total: number;
  totalActive: number;
  totalPending: number;
  totalDisabled: number;
}
