type EmBreveProps = {
  titulo: string;
};

export function EmBreve({ titulo }: EmBreveProps) {
  return (
    <header>
      <h1 className="font-sans text-3xl font-semibold">{titulo}</h1>
      <p className="mt-1 text-texto-suave">Esta seção ainda está sendo construída.</p>
    </header>
  );
}
