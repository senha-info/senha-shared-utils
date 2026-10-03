# @senhainfo/shared-utils (v2.0)

Biblioteca de utilitários de alta performance e uso compartilhado desenvolvida para o ecossistema de APIs, microsserviços e aplicações da Senha Informática.

A versão **2.0.0** é uma reescrita moderna focada em modularidade, alta performance, tipagem rigorosa no TypeScript e compatibilidade com ESM/CJS, mantendo 100% de compatibilidade retroativa com a v1.x.

---

## 🚀 O que há de novo na v2.0

* **Dual Build (CJS + ESM):** Compilado via `tsup` com suporte simultâneo a CommonJS (`.js`) e ES Modules (`.mjs`), com declarações TypeScript completas (`.d.ts`, `.d.mts`) e sourcemaps.
* **Subpaths Nativos (`package.json` exports):**
  * `import { ... } from '@senhainfo/shared-utils'` (v2 por padrão).
  * `import { ... } from '@senhainfo/shared-utils/v2'` (import explícito da v2).
  * `import { ... } from '@senhainfo/shared-utils/v1'` (código legado 100% preservado).
* **Hierarquia de Exceções (`AppException extends Error`):**
  * Agora estende a classe nativa `Error` do JavaScript, preservando stack trace completo do V8, suportando `instanceof Error`, serialização com `.toJSON()` e captura em ferramentas de observabilidade e logs (Fastify, Pino, Winston).
* **`executePromise` Modernizado:**
  * Zero dependência obrigatória do Axios em runtime (detecção via type-guard `isAxiosError`).
  * Tipagem discriminada precisa em TypeScript: `[data: T, error: null, rawError: null] | [data: null, error: string, rawError: unknown]`.
* **Funções Puras & Tree-Shaking:**
  * Utilitários de caixa (`toSnakeCase`, `toKebabCase`, `toPascalCase`, `toCamelCase`) e texto (`normalizeText`, `capitalizeText`, `removeNonAlphanumeric`, `removeLetters`, `rtfToPlainText`) disponíveis como funções puras ou através das classes clássicas (`FormatText`, `FormatCase`).
  * Correção no `toSnakeCase` que gerava prefixos indevidos em PascalCase.
* **`getIPAddress` Dinâmico e Multiplataforma:**
  * Não armazena cache estático no boot do módulo e suporta Windows, Linux, macOS, WSL e containers Docker.
* **`parseRequestURL` com WHATWG URL:**
  * Tratamento robusto de parâmetros de URL e paginação sem substituições frágeis de string.
* **`AppLog` Não-Bloqueante:**
  * Escrita e criação de diretórios 100% assíncronas com `node:fs/promises`, sem travar a thread de I/O e com formatação de data nativa (zero dependência de `date-fns`).
* **Suíte de Testes Automatizados:**
  * Testado e validado com Vitest cobrindo regras de negócio fiscais (NFe, DFe, CFOP), RTF, URLs, exceções e compatibilidade.

---

## 📦 Instalação

```bash
yarn add @senhainfo/shared-utils
# ou
npm install @senhainfo/shared-utils
```

---

## 🛠️ Exemplos de Uso (v2)

### 1. Manipulação de Nomes e Cases

```typescript
import {
  toSnakeCase,
  toKebabCase,
  toPascalCase,
  toCamelCase,
  formatCase, // ou classe FormatCase
} from '@senhainfo/shared-utils';

toSnakeCase('HelloWorld');      // 'hello_world'
toKebabCase('HelloWorld');      // 'hello-world'
toPascalCase('hello_world');    // 'HelloWorld'
toCamelCase('hello_world');     // 'helloWorld'
```

### 2. Formatação e Normalização de Texto

```typescript
import {
  normalize,
  capitalize,
  removeNonAlphanumeric,
  rtfToPlainText,
} from '@senhainfo/shared-utils';

// Limpeza de diacríticos, emojis e homóglifos (anti-spoofing)
normalize('  João da Silva 😀 '); // 'Joao da Silva'

// Capitalização inteligente com termos fiscais, preposições em PT-BR e números romanos
capitalize('emissão de nfe e dfe por joão da silva');
// 'Emissão de NFe e DFe por João da Silva'

capitalize('refrigerante 500ml e óleo 1l');
// 'Refrigerante 500ML e Óleo 1L'

// Limpeza de pontuação
removeNonAlphanumeric('Pedido #123-45!'); // 'Pedido12345'

// Conversor de RTF legado para texto plano limpo
const textoPlano = rtfToPlainText(campoRtfDoBanco);
```

### 3. Exceções e Erros Padronizados

```typescript
import {
  AppException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  isAppException,
} from '@senhainfo/shared-utils';

throw new NotFoundException({
  message: 'Cliente não encontrado',
  details: { id: 1042 },
});

// Em middlewares ou interceptors globais:
if (isAppException(error)) {
  reply.status(error.status).send(error.toJSON());
}
```

### 4. Execução Segura de Promises (`executePromise`)

```typescript
import { executePromise } from '@senhainfo/shared-utils';

// Sem necessidade de blocos try/catch:
const [cliente, erro] = await executePromise(buscarClientePorId(id));

if (erro) {
  console.error('Falha ao obter cliente:', erro);
  return;
}

console.log('Cliente obtido com sucesso:', cliente.nome);
```

### 5. Paginação e Metadados

```typescript
import { getPagination, generateMetadataResponse } from '@senhainfo/shared-utils';

// Cálculo de limites e offsets SQL
const { start, end, offset, limit } = getPagination(page, 20);
// page 1 => { start: 1, end: 20, offset: 0, limit: 20 }
// page 2 => { start: 21, end: 40, offset: 20, limit: 20 }

// Geração de metadados para APIs REST (camel-case ou snake-case)
const meta = generateMetadataResponse({
  mode: 'camel-case',
  page: 1,
  limit: 20,
  count: 85,
  baseURL: '/api/v1/clientes',
});
```

### 6. Criptografia XOR Simples e IP da Máquina

```typescript
import { xorEncrypt, getIPAddress } from '@senhainfo/shared-utils';

// Encriptação / decriptação reversível
const segredo = xorEncrypt({ value: 'Senha123', hash: 'MinhaChave' });
const original = xorEncrypt({ value: segredo, hash: 'MinhaChave' });

// IP primário da máquina (multiplataforma)
const { ipv4, ipv6 } = getIPAddress();
```

---

## 🔄 Usando a Versão Legada (v1.x)

Caso algum projeto antigo ainda necessite estritamente do comportamento e das classes da v1.x:

```typescript
// Importando diretamente pelo subpath da v1:
import { FormatText, AppException } from '@senhainfo/shared-utils/v1';

// Ou via namespace v1:
import { v1 } from '@senhainfo/shared-utils';
const ft = new v1.FormatText();
```

---

## 🧪 Testes e Qualidade de Código

Para rodar a suíte completa de validação:

```bash
# Checagem de tipagem TypeScript
yarn types:check

# Validação com ESLint
yarn lint

# Testes unitários com Vitest
yarn test

# Build dual ESM/CJS com tsup
yarn build
```

---

## 📄 Licença

MIT © [Senha Informática](https://github.com/senha-info)
