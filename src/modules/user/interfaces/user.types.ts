export interface UploadAndSaveOptions {
  filePath: string;         // Local path or temp file path
  userId: string;           // ID of the uploader
  resourceType?: 'image' | 'video' | 'auto'; // default to 'auto'
}