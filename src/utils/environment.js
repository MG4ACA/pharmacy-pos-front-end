/**
 * Check if the app is running in Electron environment
 */
export const isElectron = () => {
  return window.electronAPI !== undefined;
};

/**
 * Ensure the app is running in Electron
 * Throws an error if not
 */
export const requireElectron = () => {
  if (!isElectron()) {
    throw new Error(
      'This application must be run in Electron. Please use "npm run electron:dev" instead of opening in a browser.'
    );
  }
};
