import EncryptedStorage from 'react-native-encrypted-storage';
export async function saveData(key, value) {
  await EncryptedStorage.setItem(key, value);
}

export async function getValueFor(key) {
  let result = await EncryptedStorage.getItem(key);
  return result;
}

export async function deleteItem(key) {
  let result = await EncryptedStorage.removeItem(key);
  console.log('Deleted Token');
}
