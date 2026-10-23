import * as SecureStore from "expo-secure-store";

// AsyncStorage-shaped adapter over expo-secure-store, used as Firebase Auth's
// persistence so the session (incl. refresh token) lives in the OS keystore.
// SecureStore keys only allow [A-Za-z0-9._-] and values should stay under ~2KB,
// so keys are sanitized and values are split into chunks.

const CHUNK_SIZE = 1800;

const safeKey = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, "_");

const getItem = async (key: string): Promise<string | null> => {
    const base = safeKey(key);
    const count = await SecureStore.getItemAsync(`${base}.count`);
    if (!count) return null;
    let value = "";
    for (let i = 0; i < Number(count); i++) {
        const chunk = await SecureStore.getItemAsync(`${base}.${i}`);
        if (chunk === null) return null;
        value += chunk;
    }
    return value;
};

const removeItem = async (key: string): Promise<void> => {
    const base = safeKey(key);
    const count = await SecureStore.getItemAsync(`${base}.count`);
    if (!count) return;
    for (let i = 0; i < Number(count); i++) {
        await SecureStore.deleteItemAsync(`${base}.${i}`);
    }
    await SecureStore.deleteItemAsync(`${base}.count`);
};

const setItem = async (key: string, value: string): Promise<void> => {
    await removeItem(key);
    const base = safeKey(key);
    const chunks = Math.max(1, Math.ceil(value.length / CHUNK_SIZE));
    for (let i = 0; i < chunks; i++) {
        await SecureStore.setItemAsync(`${base}.${i}`, value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    }
    await SecureStore.setItemAsync(`${base}.count`, String(chunks));
};

export const secureStorage = { getItem, setItem, removeItem };

export const BIOMETRICS_ENABLED_KEY = "sika_biometrics_enabled";
