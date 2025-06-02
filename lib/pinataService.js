/**
 * Upload file to IPFS using Pinata HTTP API
 * @param {Buffer} buffer - File buffer to upload
 * @param {string} fileName - Name of the file
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Upload result with IPFS hash
 */
export async function uploadToPinata(buffer, fileName, metadata = {}) {
  try {
    // Check if JWT token is available
    const jwt = process.env.PINATA_JWT;
    if (!jwt || jwt === 'your-pinata-jwt-token') {
      throw new Error('Pinata JWT token not configured');
    }

    // Prepare form data
    const formData = new FormData();
    
    // Create a Blob from buffer for the form data
    const blob = new Blob([buffer], { type: metadata.mimeType || 'application/octet-stream' });
    formData.append('file', blob, fileName);
    
    // Add metadata
    const pinataMetadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        originalName: fileName,
        ...metadata
      }
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    // Add options
    const pinataOptions = JSON.stringify({
      cidVersion: 1
    });
    formData.append('pinataOptions', pinataOptions);

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Pinata upload failed: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    console.log('✅ File uploaded to Pinata:', result.IpfsHash);
    
    return {
      success: true,
      ipfsHash: result.IpfsHash,
      size: result.PinSize,
      url: `${process.env.PINATA_GATEWAY_URL}${result.IpfsHash}`,
      gateway: process.env.PINATA_GATEWAY_URL,
      timestamp: result.Timestamp
    };
    
  } catch (error) {
    console.error('❌ Pinata upload error:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

/**
 * Upload JSON data to IPFS using Pinata HTTP API
 * @param {Object} data - JSON data to upload
 * @param {string} name - Name for the JSON file
 * @returns {Promise<Object>} Upload result with IPFS hash
 */
export async function uploadJSONToPinata(data, name) {
  try {
    const jwt = process.env.PINATA_JWT;
    if (!jwt || jwt === 'your-pinata-jwt-token') {
      throw new Error('Pinata JWT token not configured');
    }

    const body = {
      pinataContent: data,
      pinataMetadata: {
        name: name,
        keyvalues: {
          uploadedAt: new Date().toISOString(),
          type: 'json'
        }
      },
      pinataOptions: {
        cidVersion: 1
      }
    };

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Pinata JSON upload failed: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      ipfsHash: result.IpfsHash,
      size: result.PinSize,
      url: `${process.env.PINATA_GATEWAY_URL}${result.IpfsHash}`,
      gateway: process.env.PINATA_GATEWAY_URL
    };
    
  } catch (error) {
    console.error('❌ Pinata JSON upload error:', error);
    throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
  }
}

/**
 * Test Pinata connection using HTTP API
 * @returns {Promise<boolean>} Connection status
 */
export async function testPinataConnection() {
  try {
    const jwt = process.env.PINATA_JWT;
    if (!jwt || jwt === 'your-pinata-jwt-token') {
      console.error('Pinata JWT token not configured');
      return false;
    }

    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    if (!response.ok) {
      console.error('Pinata authentication failed:', response.status);
      return false;
    }

    const result = await response.json();
    console.log('✅ Pinata connection successful:', result.message);
    return true;
    
  } catch (error) {
    console.error('❌ Pinata connection test failed:', error);
    return false;
  }
}
