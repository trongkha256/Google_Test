import { google } from 'googleapis';
import { DEFAULT_GOOGLE_SCOPES, GOOGLE_DRIVE_MIME_TYPE } from './constant';

export class GoogleDriveService {
  googleDrive: any;
  constructor({ credentials }) {
    const googleAuth = new google.auth.GoogleAuth({
      credentials,
      // config with drive, chat ....
      scopes: DEFAULT_GOOGLE_SCOPES.GOOGLE_DRIVE,
    });

    this.googleDrive = google.drive({
      version: 'v3',
      auth: googleAuth,
    });
  }

  async createFileOrFolder(params) {
    const result = await this.googleDrive.files.create(params);
    return result.data;
  }

  async listDirectory(params) {
    const result = await this.googleDrive.files.list(params);
    return result.data.files;
  }

  async getFolderIdByName({ name, parents }) {
    const query: any = {
      mimeType: GOOGLE_DRIVE_MIME_TYPE.FOLDER,
      name,
    };

    if (parents) {
      query.parents = parents;
    }

    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' and ');

    const folderList = await this.listDirectory({
      q: queryString,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    return folderList.length ? folderList[0].id : null;
  }

  async getFolderIdByNameOrCreateNewFolder({ name, parents }) {
    const googleDriveSubfolderId = await this.getFolderIdByName({
      parents,
      name,
    });

    if (googleDriveSubfolderId) {
      return googleDriveSubfolderId;
    } else {
      const newGoogleDriveSubfolder = await this.createFileOrFolder({
        resource: {
          name,
          parents,
          mimeType: GOOGLE_DRIVE_MIME_TYPE.FOLDER,
        },
        supportsAllDrives: true,
      });

      return newGoogleDriveSubfolder.id;
    }
  }
}
