'use client';
import { mockDataStore } from '@/lib/mock-data';

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';
const BACKUP_FILENAME = 'gestion-credit-backup.json';
const BOUNDARY = '-------314159265358979323846';

const getHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': `application/json`,
});

async function findBackupFile(
  accessToken: string
): Promise<{ id: string; modifiedTime: string } | null> {
  const headers = getHeaders(accessToken);
  const params = new URLSearchParams({
    q: `name='${BACKUP_FILENAME}' and trashed = false`,
    spaces: 'appDataFolder',
    fields: 'files(id, name, modifiedTime)',
  });
  const response = await fetch(`${DRIVE_API_URL}/files?${params}`, { headers });
  if (!response.ok) {
    console.error('Failed to search for backup file.', await response.json());
    throw new Error('Impossible de rechercher le fichier de sauvegarde.');
  }
  const data = await response.json();
  return data.files.length > 0 ? data.files[0] : null;
}

export async function getBackupMetadata(
  accessToken: string
): Promise<{ id: string; modifiedTime: string } | null> {
  return findBackupFile(accessToken);
}

export async function backupDataToGoogleDrive(
  accessToken: string
): Promise<void> {
  const file = await findBackupFile(accessToken);

  const metadata = {
    name: BACKUP_FILENAME,
    mimeType: 'application/json',
    ...(file ? {} : { parents: ['appDataFolder'] }),
  };

  const dataToBackup = JSON.stringify(mockDataStore, null, 2);
  const blob = new Blob([dataToBackup], { type: 'application/json' });

  const multipartRequestBody =
`--${BOUNDARY}
Content-Type: application/json; charset=UTF-8

${JSON.stringify(metadata)}
--${BOUNDARY}
Content-Type: application/json

${dataToBackup}
--${BOUNDARY}--`;


  const uploadUrl = file
    ? `${DRIVE_UPLOAD_URL}/files/${file.id}?uploadType=multipart`
    : `${DRIVE_UPLOAD_URL}/files?uploadType=multipart`;

  const method = file ? 'PATCH' : 'POST';

  const response = await fetch(uploadUrl, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${BOUNDARY}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Google Drive Backup Error:', error);
    throw new Error('Échec de la sauvegarde des données sur Google Drive.');
  }
}

export async function restoreDataFromGoogleDrive(
  accessToken: string
): Promise<any> {
  const file = await findBackupFile(accessToken);
  if (!file) {
    throw new Error("Aucun fichier de sauvegarde n'a été trouvé.");
  }

  const headers = getHeaders(accessToken);
  const response = await fetch(`${DRIVE_API_URL}/files/${file.id}?alt=media`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Échec du téléchargement du fichier de sauvegarde.');
  }

  return response.json();
}
