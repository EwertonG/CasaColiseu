type CampoInvalido = { campo: string; mensagem: string };

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly campos: CampoInvalido[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Opcoes = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

export async function api<T>(caminho: string, { method = 'GET', body, signal }: Opcoes = {}) {
  let res: Response;
  try {
    res = await fetch(`/api${caminho}`, {
      method,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (erro) {
    if (erro instanceof DOMException && erro.name === 'AbortError') throw erro;
    throw new ApiError(0, 'Não foi possível falar com o servidor. Verifique sua conexão.');
  }

  if (res.status === 204) return undefined as T;

  const dados = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      dados?.erro ?? 'Algo deu errado. Tente novamente.',
      dados?.campos ?? [],
    );
  }

  return dados as T;
}
