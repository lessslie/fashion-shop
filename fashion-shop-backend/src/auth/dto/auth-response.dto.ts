import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/decorators/roles.decorator';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de acceso',
  })
  accessToken: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'juan.perez@example.com',
      name: 'Juan Pérez',
      role: 'USER',
    },
    description: 'Datos del usuario autenticado',
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}
