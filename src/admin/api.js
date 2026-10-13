import { API_BASE_URL } from "../apiBase";

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Every admin call sends the session cookie plus the X-Requested-With header
// the server requires (its CSRF guard — see server/src/auth/session.js).
export async function api(method, path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/admin${path}`, {
      method,
      credentials: "include",
      headers: {
        "X-Requested-With": "integrum-admin",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON error page */ }
  if (!res.ok || data.ok === false) {
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data.code);
  }
  return data;
}

// Uploads a file straight to S3 through a short-lived signed URL from the
// server. onProgress receives 0–1. Resolves to { url, sizeLabel }.
export async function uploadFile(file, onProgress) {
  const { uploadUrl, publicUrl, sizeLabel } = await api("POST", "/uploads", {
    filename: file.name, contentType: file.type, size: file.size,
  });
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300
      ? resolve()
      : reject(new ApiError(`Upload failed (${xhr.status})`, xhr.status)));
    xhr.onerror = () => reject(new ApiError("Upload failed — the storage bucket may not allow uploads from this site yet (S3 CORS).", 0));
    xhr.send(file);
  });
  return { url: publicUrl, sizeLabel };
}
