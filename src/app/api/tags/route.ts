import { NextRequest, NextResponse } from 'next/server';
import { mockTags, tagColors, TicketTag } from '@/lib/mock-data/tickets';

// In-memory store for tags (simulates database)
const tags: TicketTag[] = [...mockTags];

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json({
    data: tags,
    total: tags.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome } = body;

    // Validate input
    if (!nome || typeof nome !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome da tag é obrigatório',
        },
        { status: 400 }
      );
    }

    const trimmedNome = nome.trim();

    // Validate length
    if (trimmedNome.length < 2 || trimmedNome.length > 30) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome da tag deve ter entre 2 e 30 caracteres',
        },
        { status: 400 }
      );
    }

    // Check if tag already exists (case insensitive)
    const existingTag = tags.find(
      (tag) => tag.nome.toLowerCase() === trimmedNome.toLowerCase()
    );

    if (existingTag) {
      return NextResponse.json({
        success: true,
        message: 'Tag já existe',
        data: existingTag,
        isExisting: true,
      });
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Assign a random color from the available colors
    const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)];

    // Create new tag
    const newTag: TicketTag = {
      id: `tag-${Date.now()}`,
      nome: trimmedNome,
      cor: randomColor,
    };

    // Add to in-memory store
    tags.push(newTag);

    return NextResponse.json({
      success: true,
      message: 'Tag criada com sucesso!',
      data: newTag,
      isExisting: false,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}
