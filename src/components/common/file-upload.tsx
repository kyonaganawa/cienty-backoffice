'use client';

import { useRef, useCallback, useState } from 'react';
import {
  Upload,
  X,
  FileImage,
  FileVideo,
  FileText,
  File,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  TicketAttachment,
  ALLOWED_FILE_TYPES,
  MAX_ATTACHMENTS,
} from '@/lib/mock-data/tickets';
import { PendingFile } from '@/hooks/upload/useFileUpload';

interface FileUploadProps {
  existingAttachments: TicketAttachment[];
  pendingFiles: PendingFile[];
  onFilesSelected: (files: File[]) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onRemovePending: (fileId: string) => void;
  disabled?: boolean;
  maxAttachments?: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) { return '0 B'; }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(type: TicketAttachment['type'] | string) {
  switch (type) {
    case 'image':
      return FileImage;
    case 'video':
      return FileVideo;
    case 'pdf':
    case 'document':
      return FileText;
    default:
      return File;
  }
}

function getFileTypeFromMime(mimeType: string): TicketAttachment['type'] | null {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimeType)) {
      return category as TicketAttachment['type'];
    }
  }
  return null;
}

export function FileUpload({
  existingAttachments,
  pendingFiles,
  onFilesSelected,
  onRemoveAttachment,
  onRemovePending,
  disabled = false,
  maxAttachments = MAX_ATTACHMENTS,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const totalCount =
    existingAttachments.length +
    pendingFiles.filter((f) => f.status === 'success').length;
  const canAddMore = totalCount < maxAttachments;

  const handleClick = useCallback(() => {
    if (!disabled && canAddMore) {
      inputRef.current?.click();
    }
  }, [disabled, canAddMore]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && canAddMore) {
        setIsDragOver(true);
      }
    },
    [disabled, canAddMore]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled && canAddMore) {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
          onFilesSelected(files);
        }
      }
    },
    [disabled, canAddMore, onFilesSelected]
  );

  const acceptedTypes = Object.values(ALLOWED_FILE_TYPES).flat().join(',');

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragOver && 'border-blue-500 bg-blue-50',
          disabled || !canAddMore
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        )}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleChange}
          className="hidden"
          disabled={disabled || !canAddMore}
        />
        <Upload
          className={cn(
            'w-8 h-8 mx-auto mb-2',
            disabled || !canAddMore ? 'text-gray-300' : 'text-gray-400'
          )}
        />
        <p
          className={cn(
            'text-sm',
            disabled || !canAddMore ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          {canAddMore
            ? 'Arraste arquivos aqui ou clique para selecionar'
            : `Limite de ${maxAttachments} arquivos atingido`}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Imagens, PDFs, Vídeos e Documentos (máx. 50MB cada)
        </p>
      </div>

      {/* Existing attachments */}
      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Anexos existentes</p>
          <div className="space-y-2">
            {existingAttachments.map((attachment) => {
              const Icon = getFileIcon(attachment.type);
              return (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt={attachment.filename}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove(
                          'hidden'
                        );
                      }}
                    />
                  ) : null}
                  <Icon
                    className={cn(
                      'w-10 h-10 text-gray-400 p-2 bg-white rounded',
                      attachment.type === 'image' && 'hidden'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAttachment(attachment.id)}
                    disabled={disabled}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending files */}
      {pendingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Novos arquivos</p>
          <div className="space-y-2">
            {pendingFiles.map((pending) => {
              const fileType = getFileTypeFromMime(pending.file.type);
              const Icon = getFileIcon(fileType || 'document');
              return (
                <div
                  key={pending.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg',
                    pending.status === 'error'
                      ? 'bg-red-50'
                      : pending.status === 'success'
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                  )}
                >
                  <Icon className="w-10 h-10 text-gray-400 p-2 bg-white rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pending.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">
                        {formatFileSize(pending.file.size)}
                      </p>
                      {pending.status === 'uploading' && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Enviando...
                        </span>
                      )}
                      {pending.status === 'success' && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Enviado
                        </span>
                      )}
                      {pending.status === 'error' && (
                        <span className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {pending.error || 'Erro'}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePending(pending.id)}
                    disabled={pending.status === 'uploading'}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-gray-500 text-right">
        {totalCount} de {maxAttachments} arquivos
      </p>
    </div>
  );
}
