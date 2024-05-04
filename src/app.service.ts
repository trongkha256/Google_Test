import { Injectable } from '@nestjs/common';
import { GoogleDriveService } from './libs/google/googleDriveService';

@Injectable()
export class AppService {
  getHello(): string {
    const googleDriveService = new GoogleDriveService({
      credentials: JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS).web,
    });
    console.log('googleDriveService: ', googleDriveService);
    return 'Hello World!';
  }
}
