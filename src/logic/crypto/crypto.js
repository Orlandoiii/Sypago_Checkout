export async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256"
        },
        true, ["encrypt", "decrypt"]
    );

    const publicKey = await exportKey(keyPair.publicKey);
    const privateKey = await exportKey(keyPair.privateKey);

    return { publicKey, privateKey };
}
export async function encryptData(publicKey, data) {
    const key = await importKey(publicKey, "public");
    const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" },
        key,
        data
    );
    return bufferToBase64(encrypted);
}
export async function decryptData(privateKey, encryptedData) {
    const key = await importKey(privateKey, "private");
    const data = base64ToBuffer(encryptedData);
    return window.crypto.subtle.decrypt({ name: "RSA-OAEP" },
        key,
        data
    );
}
async function exportKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        key.type === "public" ? "spki" : "pkcs8",
        key
    );

    const base64 = bufferToBase64(exported);

    if (key.type === "public") {
        const lines = [];
        for (let i = 0; i < base64.length; i += 64) {
            lines.push(base64.substring(i, i + 64));
        }

        return "-----BEGIN PUBLIC KEY-----\n" +
            lines.join("\n") +
            "\n-----END PUBLIC KEY-----";
    } else {
        const lines = [];
        for (let i = 0; i < base64.length; i += 64) {
            lines.push(base64.substring(i, i + 64));
        }

        return "-----BEGIN PRIVATE KEY-----\n" +
            lines.join("\n") +
            "\n-----END PRIVATE KEY-----";
    }
}
async function importKey(keyBase64, type) {
    let cleanKey = keyBase64;
    if (type === "public" && keyBase64.includes("BEGIN PUBLIC KEY")) {
        cleanKey = keyBase64
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replace(/\n/g, "");
    } else if (type === "private" && keyBase64.includes("BEGIN PRIVATE KEY")) {
        cleanKey = keyBase64
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .replace(/\n/g, "");
    }

    const keyData = base64ToBuffer(cleanKey);
    return window.crypto.subtle.importKey(
        type === "public" ? "spki" : "pkcs8",
        keyData, { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        type === "public" ? ["encrypt"] : ["decrypt"]
    );
}

function bufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
}

export async function decryptSymmetricKey(privateKey, encryptedSymmetricKey) {
    const key = await importKey(privateKey, "private");
    const encryptedKeyBuffer = base64ToBuffer(encryptedSymmetricKey);

    const decryptedKeyBuffer = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" },
        key,
        encryptedKeyBuffer
    );

    return new Uint8Array(decryptedKeyBuffer);
}

export async function encryptWithSymmetricKey(symmetricKey, data) {
    const nonce = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await window.crypto.subtle.importKey(
        "raw",
        symmetricKey, { name: "AES-GCM", length: 256 },
        false, ["encrypt"]
    );

    const dataBuffer = typeof data === 'string' ?
        new TextEncoder().encode(data) :
        data;

    const encryptedBuffer = await window.crypto.subtle.encrypt({
            name: "AES-GCM",
            iv: nonce,
            tagLength: 128
        },
        key,
        dataBuffer
    );


    const result = new Uint8Array(nonce.length + encryptedBuffer.byteLength);
    result.set(nonce, 0);
    result.set(new Uint8Array(encryptedBuffer), nonce.length);

    return bufferToBase64(result);
}

export async function decryptWithSymmetricKey(symmetricKey, encryptedData) {
    try {

        const encryptedBuffer = base64ToBuffer(encryptedData);
        const encryptedArray = new Uint8Array(encryptedBuffer);

        const nonce = encryptedArray.slice(0, 12);

        const ciphertext = encryptedArray.slice(12);

        const key = await window.crypto.subtle.importKey(
            "raw",
            symmetricKey, { name: "AES-GCM", length: 256 },
            false, ["decrypt"]
        );

        const decryptedBuffer = await window.crypto.subtle.decrypt({
                name: "AES-GCM",
                iv: nonce,
                tagLength: 128
            },
            key,
            ciphertext
        );

        const text = new TextDecoder().decode(decryptedBuffer);

        return {
            buffer: Array.from(new Uint8Array(decryptedBuffer)),
            text: text
        };
    } catch (error) {
        console.error("Error en decryptWithSymmetricKey:", error);
        throw error;
    }
}