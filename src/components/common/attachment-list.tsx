'use client';

import { useState } from 'react';
import {
  FileImage,
  FileVideo,
  FileText,
  File,
  Download,
  Eye,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TicketAttachment } from '@/lib/mock-data/tickets';

interface AttachmentListProps {
  attachments: TicketAttachment[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFileIcon(type: TicketAttachment['type']) {
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

function getTypeLabel(type: TicketAttachment['type']): string {
  const labels = {
    image: 'Imagem',
    video: 'Vídeo',
    pdf: 'PDF',
    document: 'Documento',
  };
  return labels[type] || 'Arquivo';
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  const [previewImage, setPreviewImage] = useState<TicketAttachment | null>(
    null
  );

  if (attachments.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment) => {
          const Icon = getFileIcon(attachment.type);
          const isImage = attachment.type === 'image';

          return (
            <div
              key={attachment.id}
              className="border rounded-lg overflow-hidden bg-white"
            >
              {/* Preview area */}
              <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                {isImage ? (
                  <>
                    <img
                      src={attachment.url}
                      alt={attachment.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove(
                          'hidden'
                        );
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-gray-400" />
                    </div>
                    <button
                      onClick={() => setPreviewImage(attachment)}
                      className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center group"
                    >
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </>
                ) : (
                  <Icon className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p
                  className="text-sm font-medium text-gray-900 truncate"
                  title={attachment.filename}
                >
                  {attachment.filename}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{getTypeLabel(attachment.type)}</span>
                  <span>•</span>
                  <span>{formatFileSize(attachment.size)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enviado por {attachment.uploadedBy.nome}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(attachment.uploadedAt)}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {isImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPreviewImage(attachment)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a
                      href={attachment.url}
                      download={attachment.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Baixar
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.filename}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b-lg">
              <p className="font-medium">{previewImage.filename}</p>
              <p className="text-sm text-gray-300">
                {formatFileSize(previewImage.size)} • Enviado por{' '}
                {previewImage.uploadedBy.nome}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
