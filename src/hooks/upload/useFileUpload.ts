'use client';

import { useState, useCallback } from 'react';
import {
  TicketAttachment,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_ATTACHMENTS,
} from '@/lib/mock-data/tickets';

export interface PendingFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  attachment?: TicketAttachment;
}

interface UseFileUploadOptions {
  uploader: {
    id: string;
    nome: string;
    email: string;
  };
  maxAttachments?: number;
  existingAttachmentsCount?: number;
}

function isValidFileType(mimeType: string): boolean {
  return Object.values(ALLOWED_FILE_TYPES).some((types) =>
    types.includes(mimeType)
  );
}

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `Arquivo "${file.name}" muito grande (máximo 50MB)`;
  }
  if (!isValidFileType(file.type)) {
    return `Tipo de arquivo "${file.name}" não permitido`;
  }
  return null;
}

export function useFileUpload({
  uploader,
  maxAttachments = MAX_ATTACHMENTS,
  existingAttachmentsCount = 0,
}: UseFileUploadOptions) {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (pendingFile: PendingFile): Promise<TicketAttachment | null> => {
      const formData = new FormData();
      formData.append('file', pendingFile.file);
      formData.append('uploaderId', uploader.id);
      formData.append('uploaderNome', uploader.nome);
      formData.append('uploaderEmail', uploader.email);

      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          return result.data as TicketAttachment;
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        throw error;
      }
    },
    [uploader]
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      const currentCount =
        existingAttachmentsCount +
        pendingFiles.filter((f) => f.status === 'success').length;
      const availableSlots = maxAttachments - currentCount;

      if (availableSlots <= 0) {
        return;
      }

      const filesToAdd = files.slice(0, availableSlots);
      const newPendingFiles: PendingFile[] = [];

      for (const file of filesToAdd) {
        const validationError = validateFile(file);
        if (validationError) {
          newPendingFiles.push({
            id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            status: 'error',
            progress: 0,
            error: validationError,
          });
        } else {
          newPendingFiles.push({
            id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            status: 'pending',
            progress: 0,
          });
        }
      }

      setPendingFiles((prev) => [...prev, ...newPendingFiles]);

      // Start uploading valid files
      setIsUploading(true);

      for (const pending of newPendingFiles) {
        if (pending.status === 'pending') {
          // Update status to uploading
          setPendingFiles((prev) =>
            prev.map((f) =>
              f.id === pending.id ? { ...f, status: 'uploading', progress: 50 } : f
            )
          );

          try {
            const attachment = await uploadFile(pending);
            if (attachment) {
              setPendingFiles((prev) =>
                prev.map((f) =>
                  f.id === pending.id
                    ? { ...f, status: 'success' as const, progress: 100, attachment }
                    : f
                )
              );
            }
          } catch (error) {
            setPendingFiles((prev) =>
              prev.map((f) =>
                f.id === pending.id
                  ? {
                      ...f,
                      status: 'error',
                      progress: 0,
                      error:
                        error instanceof Error
                          ? error.message
                          : 'Erro ao enviar arquivo',
                    }
                  : f
              )
            );
          }
        }
      }

      setIsUploading(false);
    },
    [existingAttachmentsCount, maxAttachments, pendingFiles, uploadFile]
  );

  const removePending = useCallback((fileId: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const clearAll = useCallback(() => {
    setPendingFiles([]);
  }, []);

  const getCompletedAttachments = useCallback((): TicketAttachment[] => {
    return pendingFiles
      .filter((f) => f.status === 'success' && f.attachment)
      .map((f) => f.attachment!);
  }, [pendingFiles]);

  const hasErrors = pendingFiles.some((f) => f.status === 'error');
  const isComplete = pendingFiles.every(
    (f) => f.status === 'success' || f.status === 'error'
  );

  return {
    pendingFiles,
    isUploading,
    hasErrors,
    isComplete,
    addFiles,
    removePending,
    clearAll,
    getCompletedAttachments,
  };
}
