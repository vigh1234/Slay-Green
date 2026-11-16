const fs = require('fs').promises;
const path = require('path');

const folderName = path.join(__dirname, '../DataBase');

const writeDataToJSONFile = async (fileName, data) => {
  try {
    // Ensure folder exists
    await fs.mkdir(folderName, { recursive: true });

    const filePath = path.join(folderName, fileName);

    // Ensure file exists, or initialize with an empty array
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([]));
    }

    // Read, update, and write data
    const fileContent = await fs.readFile(filePath, 'utf8');
    const existingData = JSON.parse(fileContent);
    existingData.push(data);
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    console.log(`Data written to '${filePath}' successfully.`);
  } catch (error) {
    console.error('Error writing to file:', error.message);
  }
};

module.exports = writeDataToJSONFile;
