// --- Interfaces para Entidades do Backend ---

interface Responsavel {
  idUsuario: number;
  nome: string;
  email: string;
}

export interface Pet {
  id: number;
  tipo: "CACHORRO" | "GATO";
  nome: string;
  temperamento: string;
  descricao: string;
  idade: number;
  urlFoto: string;
  responsavel?: Responsavel;
}

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  cargos: string[];
  ativo: boolean;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: Responsavel;
  recipient: Responsavel;
  timestamp: string;
  conversationId: string;
}

// --- Interfaces para Respostas da API e DTOs ---

// DTO para o resumo da conversa no dashboard da ONG
export interface ConversationSummary {
  conversationId: string;
  petNome: string;
  usuarioNome: string;
  ultimaMensagem: string;
  timestamp: string;
}

// DTO para o cadastro de um pet
export interface PetCadastroDto {
  tipo: "CACHORRO" | "GATO";
  nome: string;
  temperamento: string;
  descricao?: string;
  idade: number;
}

// Interface genérica para respostas paginadas da API
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// --- Interfaces para o Estado do Redux e Componentes ---

export interface MultiActionAreaCardProps {
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  detailLink: string; // Nova prop
}

export interface LikeStateProps {
  likes: Record<string, boolean>;
}
