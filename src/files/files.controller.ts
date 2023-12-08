import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Get,
  UseGuards,
  Delete,
  Res,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
@ApiTags('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll(
    @UserId() userId: number,
    @Query('sharedToken') sharedToken: string,
    @Res() res: Response,
  ) {
    if (sharedToken) {
      const fileId = await this.filesService.getFileIdBySharedToken(
        sharedToken,
      );
      if (fileId) {
        return res.redirect(307, `/files/${fileId}/download`);
      } else {
        return res.status(404).send('File not found or shared link expired');
      }
    } else {
      const files = await this.filesService.findAll(userId);
      return res.json(files);
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: number,
  ) {
    return this.filesService.create(file, userId);
  }

  @Delete()
  remove(@UserId() userId: number, @Query('ids') ids: string) {
    // files?ids=1,2,7,8
    return this.filesService.remove(userId, ids);
  }

  @Get('getHistory/')
  async getHistory(
    @UserId() userId: number
  ) {
    return this.filesService.getHistory(userId);
  }

  @Get(':id/download')
  async download(
    @Res() res: Response,
    @UserId() userId: number,
    @Param('id') fileId: number,
  ) {
    const { fileStream, filename, fileType } =
      await this.filesService.getFileStream(userId, fileId);
    res.setHeader('Content-Type', fileType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    fileStream.pipe(res);
  }

  @Get(':fileId/getSharedLink/')
  async getSharedLink(
    @UserId() userId: number,
    @Param('fileId') fileId: number,
  ) {
    return this.filesService.getSharedLink(userId, fileId);
  }
}
