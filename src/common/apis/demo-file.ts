import type { UploadedFile } from "./types/demo-file"
import { request } from "@/http/axios"

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true"

type UploadProgress = (percent: number) => void

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function mockUploadFile(file: File, onProgress?: UploadProgress): Promise<UploadedFile> {
  for (const percent of [25, 50, 75, 100]) {
    await wait(120)
    onProgress?.(percent)
  }

  return {
    id: Date.now(),
    name: file.name,
    size: file.size
  }
}

async function mockDownloadFile(): Promise<Blob> {
  await wait(300)
  return new Blob(["Vue3 template file download demo"], { type: "text/plain;charset=utf-8" })
}

export function uploadDemoFile(file: File, onProgress?: UploadProgress): Promise<UploadedFile> {
  if (USE_MOCK) return mockUploadFile(file, onProgress)

  const data = new FormData()
  data.append("file", file)

  return request<UploadedFile>({
    url: "/files",
    method: "post",
    data,
    onUploadProgress(event) {
      if (!event.total) return
      onProgress?.(Math.round((event.loaded / event.total) * 100))
    }
  })
}

export function downloadDemoFile(id: number): Promise<Blob> {
  if (USE_MOCK) return mockDownloadFile()

  return request<Blob>({
    url: `/files/${id}/download`,
    method: "get",
    responseType: "blob"
  })
}
