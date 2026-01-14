import { NextRequest, NextResponse } from 'next/server';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  TicketAttachment,
} from '@/lib/mock-data/tickets';

function getFileTypeCategory(
  mimeType: string
): TicketAttachment['type'] | null {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimeType)) {
      return category as TicketAttachment['type'];
    }
  }
  return null;
}

function generateMockS3Url(filename: string, type: string): string {
  const bucket = 'covalenty-backoffice-dev';
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `https://${bucket}.s3.amazonaws.com/tickets/attachments/${type}/${timestamp}_${sanitizedFilename}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const uploaderId = formData.get('uploaderId') as string;
    const uploaderNome = formData.get('uploaderNome') as string;
    const uploaderEmail = formData.get('uploaderEmail') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande (máximo 50MB)' },
        { status: 400 }
      );
    }

    // Determine file type category
    const fileType = getFileTypeCategory(file.type);
    if (!fileType) {
      return NextResponse.json(
        { success: false, error: 'Tipo de arquivo não permitido' },
        { status: 400 }
      );
    }

    // Simulate API delay (500ms - 1500ms)
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    // Generate mock S3 URL
    const mockS3Url = generateMockS3Url(file.name, fileType);

    const attachment: TicketAttachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      filename: file.name,
      url: mockS3Url,
      type: fileType,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: {
        id: uploaderId || 'unknown',
        nome: uploaderNome || 'Unknown User',
        email: uploaderEmail || 'unknown@example.com',
      },
    };

    return NextResponse.json({
      success: true,
      message: 'Arquivo enviado com sucesso!',
      data: attachment,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
