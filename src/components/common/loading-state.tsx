interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">{message}</div>
    </div>
  );
}
