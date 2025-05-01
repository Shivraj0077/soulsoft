// utils/cloudflare.js
export async function uploadToCloudflare(file, applicantId) {
    try {
      // Convert file to FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata including applicant ID for organization
      formData.append('metadata', JSON.stringify({
        applicantId: applicantId,
        uploadDate: new Date().toISOString()
      }));
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      const data = await response.json();
      return data.url; // Return the URL of the uploaded file
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }