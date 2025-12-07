import client from '../api/client';

class BackupService {
  /**
   * Create a new database backup
   * @returns {Promise<Object>} Backup result
   */
  static async createBackup() {
    try {
      const response = await client.post('/backup');
      return response;
    } catch (error) {
      console.error('BackupService.createBackup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create backup',
      };
    }
  }

  /**
   * Get list of all backups
   * @returns {Promise<Object>} List of backups
   */
  static async listBackups() {
    try {
      const response = await client.get('/backup');
      return response;
    } catch (error) {
      console.error('BackupService.listBackups error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to list backups',
        data: [],
      };
    }
  }

  /**
   * Download a backup file
   * @param {string} fileName - Name of the backup file
   */
  static async downloadBackup(fileName) {
    try {
      const response = await client.get(`/backup/download/${fileName}`, {
        responseType: 'blob',
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('BackupService.downloadBackup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to download backup',
      };
    }
  }

  /**
   * Delete a backup file
   * @param {string} fileName - Name of the backup file to delete
   * @returns {Promise<Object>} Delete result
   */
  static async deleteBackup(fileName) {
    try {
      const response = await client.delete(`/backup/${fileName}`);
      return response;
    } catch (error) {
      console.error('BackupService.deleteBackup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete backup',
      };
    }
  }
}

export default BackupService;
