import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestWithUser } from '../common/interfaces';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== OBTENER MI PERFIL ====================
  @Get('profile')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Retorna los datos del perfil del usuario actual (sin password)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  getProfile(@Req() req: RequestWithUser) {
    return this.usersService.getProfile(req.user.id);
  }

  // ==================== ACTUALIZAR MI PERFIL ====================
  @Patch('profile')
  @ApiOperation({
    summary: 'Actualizar perfil del usuario',
    description:
      'Permite al usuario actualizar su nombre, email o teléfono. Si cambia el email, se verifica que no esté en uso.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está en uso',
  })
  updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  // ==================== CAMBIAR CONTRASEÑA ====================
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description:
      'Permite al usuario cambiar su contraseña. Requiere la contraseña actual para confirmar.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Contraseña actual incorrecta o nueva contraseña inválida',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user.id, changePasswordDto);
    return {
      message: 'Contraseña cambiada exitosamente',
    };
  }

  // ==================== ELIMINAR MI CUENTA ====================
  @Delete('account')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar cuenta de usuario',
    description:
      'Elimina permanentemente la cuenta del usuario. Esta acción no se puede deshacer.',
  })
  @ApiResponse({
    status: 204,
    description: 'Cuenta eliminada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  deleteAccount(@Req() req: RequestWithUser) {
    return this.usersService.deleteAccount(req.user.id);
  }
}
