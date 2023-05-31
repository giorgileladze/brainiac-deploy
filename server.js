const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

const repoOwner = 'bklomi';
const repoName = 'brainiac-front';
const localFilePath = './lastCommitSHA.txt';
const personalAccessToken = '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';

const getLatestCommitSHA = async () => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`, {
      headers: {
        Authorization: `Bearer ${personalAccessToken}`,
      },
    });
    const latestCommitSHA = response.data[0].sha;
    return latestCommitSHA;
  } catch (error) {
    console.error('Error fetching latest commit SHA:', error.message);
    throw error;
  }
};

const hasCodebaseChanged = async (latestCommitSHA) => {
  try {
    if (fs.existsSync(localFilePath)) {
      const lastCommitSHA = fs.readFileSync(localFilePath, 'utf-8');
      return latestCommitSHA !== lastCommitSHA;
    } else {
      return true; // No previous commit SHA found, assume codebase has changed
    }
  } catch (error) {
    console.error('Error checking if codebase has changed:', error.message);
    throw error;
  }
};

const executeDeployScript = () => {
  exec('sh deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing deploy.sh:', error.message);
    } else {
      console.log('Deploy script executed successfully');
    }
  });
};

const updateLastCommitSHA = (latestCommitSHA) => {
  fs.writeFileSync(localFilePath, latestCommitSHA);
};

const checkAndUpdateCodebase = async () => {
  try {
    const latestCommitSHA = await getLatestCommitSHA();
    const codebaseChanged = await hasCodebaseChanged(latestCommitSHA);
    if (codebaseChanged) {
      executeDeployScript();
      updateLastCommitSHA(latestCommitSHA);
    } else {
      console.log('Codebase has not changed since the last pull');
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
};

checkAndUpdateCodebase();
setInterval(checkAndUpdateCodebase, 10 * 1000); // 10 seconds





