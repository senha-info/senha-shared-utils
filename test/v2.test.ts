import { describe, expect, it } from 'vitest';
import {
  AppException,
  assignDefaultValues,
  BadRequestException,
  capitalize,
  capitalizeText,
  ConflictException,
  executePromise,
  ForbiddenException,
  FormatCase,
  formatCase,
  FormatText,
  formatText,
  generateMetadataResponse,
  getIPAddress,
  getPagination,
  getRandomData,
  HttpStatusCodes,
  InternalServerException,
  isAppException,
  normalize,
  normalizeText,
  NotFoundException,
  UnprocessableEntityException,
  parseRequestURL,
  removeLetters,
  removeNonAlphanumeric,
  removeUndefinedProps,
  rtfToPlainText,
  splitArray,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
  UnauthorizedException,
  v1,
  WindowsService,
  xorEncrypt,
} from '../src/index.js';

describe('FormatCase (v2)', () => {
  it('converts properly to snake_case without leading underscore for PascalCase', () => {
    expect(toSnakeCase('HelloWorld')).toBe('hello_world');
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
    expect(toSnakeCase('hello-world')).toBe('hello_world');
    expect(toSnakeCase('hello_world')).toBe('hello_world');
    expect(toSnakeCase('getHTTPResponse')).toBe('get_http_response');
    expect(toSnakeCase('foo bar')).toBe('foo_bar');
    expect(toSnakeCase('')).toBe('');
    expect(toSnakeCase(null)).toBe('');
  });

  it('converts properly to kebab-case', () => {
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toKebabCase('hello_world')).toBe('hello-world');
    expect(toKebabCase('foo bar')).toBe('foo-bar');
  });

  it('converts properly to PascalCase and camelCase', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
    expect(toPascalCase('hello_world')).toBe('HelloWorld');
    expect(toPascalCase('hello world')).toBe('HelloWorld');

    expect(toCamelCase('hello-world')).toBe('helloWorld');
    expect(toCamelCase('HelloWorld')).toBe('helloWorld');
    expect(toCamelCase('hello_world')).toBe('helloWorld');
  });

  it('supports FormatCase class and instance', () => {
    const fc = new FormatCase();
    expect(fc.toSnakeCase('HelloWorld')).toBe('hello_world');
    expect(formatCase.toCamelCase('hello_world')).toBe('helloWorld');
  });
});

describe('FormatText (v2)', () => {
  it('normalizes diacritics, emojis, and whitespace', () => {
    expect(normalize('  João da Silva  ')).toBe('Joao da Silva');
    expect(normalizeText('Olá mundo! 😀')).toBe('Ola mundo!');
    expect(normalize('Café', { removeDiacritics: false })).toBe('Café');
    expect(normalize('Long string here', { maxLength: 4 })).toBe('Long');
    expect(normalize(null)).toBeNull();
    expect(normalize(undefined)).toBeUndefined();
  });

  it('capitalizes according to Brazilian rules, fiscal terms, and acronyms', () => {
    expect(capitalize('joão da silva')).toBe('João da Silva');
    expect(capitalize('de souza e silva')).toBe('De Souza e Silva');
    expect(capitalize('emissão de nfe e dfe')).toBe('Emissão de NFe e DFe');
    expect(capitalize('termo cfop e efd')).toBe('Termo CFOP e EFD');
    expect(capitalize('refrigerante 500ml')).toBe('Refrigerante 500ML');
    expect(capitalize('óleo 1l')).toBe('Óleo 1L');
    expect(capitalize("d'angelo")).toBe("D'Angelo");
    expect(capitalize('produto a/b')).toBe('Produto A/B');
    expect(capitalize('dom pedro ii')).toBe('Dom Pedro II');
    expect(capitalize('primeira frase longa', 'first-letter')).toBe('Primeira frase longa');
    expect(capitalizeText(null)).toBeNull();
  });

  it('removes non-alphanumeric and letters correctly', () => {
    expect(removeNonAlphanumeric('Doc #123-45!')).toBe('Doc12345');
    expect(removeLetters('123abc456DEF')).toBe('123456');
  });

  it('converts RTF to plain text', () => {
    const rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}} \\f0\\fs20 Olá \\b Mundo\\b0!\\par Segunda linha.}';
    const plain = rtfToPlainText(rtf);
    expect(plain).toContain('Olá Mundo!');
    expect(plain).toContain('Segunda linha.');
  });

  it('supports FormatText class and instance', () => {
    const ft = new FormatText();
    expect(ft.normalize('  Teste  ')).toBe('Teste');
    expect(formatText.capitalize('maria')).toBe('Maria');
  });
});

describe('Exceptions (v2)', () => {
  it('instantiates AppException with default values', () => {
    const error = new AppException();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppException);
    expect(error.name).toBe('AppException');
    expect(error.code).toBeUndefined();
    expect(error.message).toBe('Erro ao processar requisição');
    expect(error.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(error.details).toBeUndefined();
    expect(error.cause).toBeUndefined();
    expect(error.isOperational).toBe(true);
    expect(typeof error.timestamp).toBe('string');
    expect(new Date(error.timestamp).getTime()).not.toBeNaN();
    expect(error.stack).toBeDefined();

    const json = error.toJSON();
    expect(json.name).toBe('AppException');
    expect(json.code).toBeUndefined();
    expect(json.status).toBe(400);
    expect(json.message).toBe('Erro ao processar requisição');
  });

  it('supports shorthand string message instantiation', () => {
    const error = new AppException('Falha ao processar pagamento');

    expect(error.message).toBe('Falha ao processar pagamento');
    expect(error.code).toBeUndefined();
    expect(error.status).toBe(HttpStatusCodes.BAD_REQUEST);
  });

  it('supports modern props object configuration with custom code and cause error chaining', () => {
    const causeError = new Error('Database connection timed out');
    const error = new AppException({
      message: 'Não foi possível salvar o registro',
      code: 'DB_ERROR',
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      details: { table: 'users' },
      cause: causeError,
    });

    expect(error.message).toBe('Não foi possível salvar o registro');
    expect(error.code).toBe('DB_ERROR');
    expect(error.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(error.details).toEqual({ table: 'users' });
    expect(error.cause).toBe(causeError);

    const json = error.toJSON();
    expect(json.code).toBe('DB_ERROR');
  });

  it('serializes to JSON correctly with toJSON()', () => {
    const error = new BadRequestException({
      message: 'Dados inválidos',
      code: 'INVALID_FIELDS',
      details: [{ field: 'email', reason: 'invalid format' }],
    });

    const json = error.toJSON();
    expect(json.name).toBe('BadRequestException');
    expect(json.code).toBe('INVALID_FIELDS');
    expect(json.message).toBe('Dados inválidos');
    expect(json.status).toBe(400);
    expect(json.details).toEqual([{ field: 'email', reason: 'invalid format' }]);
    expect(typeof json.timestamp).toBe('string');
  });

  it('correctly identifies AppException via isAppException type-guard', () => {
    const appError = new BadRequestException('Erro');
    const genericError = new Error('Erro genérico');
    const duckTypedError = {
      message: 'Erro',
      status: 400,
    };

    expect(isAppException(appError)).toBe(true);
    expect(isAppException(duckTypedError)).toBe(true);
    expect(isAppException(genericError)).toBe(false);
    expect(isAppException(null)).toBe(false);
    expect(isAppException('string error')).toBe(false);
  });

  it('provides specialized HTTP exception subclasses with correct defaults and string shorthand', () => {
    const badRequest = new BadRequestException('Entrada inválida');
    expect(badRequest.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(badRequest.code).toBeUndefined();
    expect(badRequest.name).toBe('BadRequestException');
    expect(badRequest.message).toBe('Entrada inválida');

    const unauthorized = new UnauthorizedException();
    expect(unauthorized.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    expect(unauthorized.code).toBeUndefined();
    expect(unauthorized.name).toBe('UnauthorizedException');
    expect(unauthorized.message).toBe('Não autorizado');

    const forbidden = new ForbiddenException();
    expect(forbidden.status).toBe(HttpStatusCodes.FORBIDDEN);
    expect(forbidden.code).toBeUndefined();

    const notFound = new NotFoundException('Item não encontrado');
    expect(notFound.status).toBe(HttpStatusCodes.NOT_FOUND);
    expect(notFound.code).toBeUndefined();
    expect(notFound.message).toBe('Item não encontrado');

    const conflict = new ConflictException();
    expect(conflict.status).toBe(HttpStatusCodes.CONFLICT);
    expect(conflict.code).toBeUndefined();

    const unprocessable = new UnprocessableEntityException();
    expect(unprocessable.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    expect(unprocessable.code).toBeUndefined();

    const internal = new InternalServerException();
    expect(internal.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(internal.code).toBeUndefined();

    // Supports custom code if passed
    const withCustomCode = new UnauthorizedException({
      code: 'INVALID_CREDENTIALS',
      message: 'Usuário ou senha incorretos',
    });
    expect(withCustomCode.code).toBe('INVALID_CREDENTIALS');
    expect(withCustomCode.message).toBe('Usuário ou senha incorretos');
  });
});

describe('executePromise (v2)', () => {
  it('returns [result, null, null] on success', async () => {
    const promise = Promise.resolve({ success: true, count: 42 });
    const [data, error, rawError] = await executePromise(promise);

    expect(data).toEqual({ success: true, count: 42 });
    expect(error).toBeNull();
    expect(rawError).toBeNull();
  });

  it('returns [null, message, rawError] on Error rejection', async () => {
    const promise = Promise.reject(new Error('Database timeout'));
    const [data, error, rawError] = await executePromise(promise);

    expect(data).toBeNull();
    expect(error).toBe('Database timeout');
    expect(rawError).toBeInstanceOf(Error);
  });

  it('formats message nicely for AppException', async () => {
    const appErr = new NotFoundException({ message: 'User not found' });
    const [data, error, rawError] = await executePromise(Promise.reject(appErr));

    expect(data).toBeNull();
    expect(error).toBe('(404) User not found');
    expect(rawError).toBe(appErr);

    const appErrWithCode = new NotFoundException({
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    });
    const [, errWithCode] = await executePromise(Promise.reject(appErrWithCode));
    expect(errWithCode).toBe('(404 - USER_NOT_FOUND) User not found');
  });

  it('formats message nicely for duck-typed AxiosError', async () => {
    const fakeAxiosErr = {
      isAxiosError: true,
      message: 'Request failed with status 500',
      response: {
        data: { message: 'Internal upstream error' },
      },
    };

    const [data, error] = await executePromise(Promise.reject(fakeAxiosErr));
    expect(data).toBeNull();
    expect(error).toBe(JSON.stringify({ message: 'Internal upstream error' }));
  });

  it('allows seamless destructuring of result properties without null assertions', async () => {
    interface DetailedProduct {
      id: string;
      name: string;
    }
    interface GetProductByIdResponse {
      product: DetailedProduct;
    }

    const getProductById = async (): Promise<GetProductByIdResponse> => {
      return { product: { id: 'p1', name: 'Product A' } };
    };

    const [result, error] = await executePromise(getProductById());

    if (error) {
      throw new Error(error);
    }

    const { product } = result;
    expect(product.id).toBe('p1');
    expect(product.name).toBe('Product A');
  });
});

describe('parseRequestURL and generateMetadataResponse (v2)', () => {
  it('parses request URLs safely using WHATWG URL parser', () => {
    const res1 = parseRequestURL(1, 5, '/api/users?status=active');
    expect(res1.previousURL).toBeNull();
    expect(res1.nextURL).toBe('/api/users?status=active&page=2');

    const res2 = parseRequestURL(3, 5, 'https://example.com/api/users?page=3');
    expect(res2.previousURL).toBe('https://example.com/api/users?page=2');
    expect(res2.nextURL).toBe('https://example.com/api/users?page=4');

    const res3 = parseRequestURL(5, 5, '/api/users?page=5');
    expect(res3.previousURL).toBe('/api/users?page=4');
    expect(res3.nextURL).toBeNull();

    const resOver = parseRequestURL(10, 5, '/api/users?page=10');
    expect(resOver.previousURL).toBe('/api/users?page=5');
    expect(resOver.nextURL).toBeNull();
  });

  it('generates metadata response in camel-case and snake-case', () => {
    const camel = generateMetadataResponse({
      mode: 'camel-case',
      page: 2,
      limit: 10,
      count: 35,
      baseURL: '/items',
      tenantId: '123',
    });

    expect(camel.count).toBe(35);
    expect(camel.maxPage).toBe(4);
    expect(camel.limit).toBe(10);
    expect(camel.previousURL).toBe('/items?page=1');
    expect(camel.nextURL).toBe('/items?page=3');
    expect(camel.extra).toEqual({ tenantId: '123' });

    const snake = generateMetadataResponse({
      mode: 'snake-case',
      page: 1,
      limit: 10,
      count: 20,
      baseURL: '/items',
    });

    expect(snake.count).toBe(20);
    expect(snake.max_page).toBe(2);
    expect(snake.limit).toBe(10);
    expect(snake.previous_url).toBeNull();
    expect(snake.next_url).toBe('/items?page=2');
  });

  it('formats extra properties keys according to mode and supports formatExtraKeys: false', () => {
    // Default snake-case converts camelCase extra props to snake_case
    const snakeWithExtra = generateMetadataResponse({
      mode: 'snake-case',
      page: 1,
      limit: 10,
      count: 20,
      baseURL: '/items',
      debugId: '123',
      totalActiveUsers: 50,
    });

    expect(snakeWithExtra.extra).toEqual({
      debug_id: '123',
      total_active_users: 50,
    });

    // Default camel-case converts snake_case extra props to camelCase
    const camelWithExtra = generateMetadataResponse({
      mode: 'camel-case',
      page: 1,
      limit: 10,
      count: 20,
      baseURL: '/items',
      tenant_id: 'abc',
      is_admin_user: true,
    });

    expect(camelWithExtra.extra).toEqual({
      tenantId: 'abc',
      isAdminUser: true,
    });

    // formatExtraKeys: false preserves original keys verbatim
    const verbatim = generateMetadataResponse({
      mode: 'snake-case',
      page: 1,
      limit: 10,
      count: 20,
      baseURL: '/items',
      formatExtraKeys: false,
      debugId: '123',
      'X-Custom-Header': 'custom',
    });

    expect(verbatim.extra).toEqual({
      debugId: '123',
      'X-Custom-Header': 'custom',
    });
  });
});

describe('getPagination (v2)', () => {
  it('calculates start, end, offset and limit correctly', () => {
    expect(getPagination(1, 10)).toEqual({
      start: 1,
      end: 10,
      offset: 0,
      limit: 10,
    });

    expect(getPagination(2, 20)).toEqual({
      start: 21,
      end: 40,
      offset: 20,
      limit: 20,
    });
  });
});

describe('splitArray (v2)', () => {
  it('splits array into chunks', () => {
    expect(splitArray({ baseArray: [1, 2, 3, 4, 5], limit: 2 })).toEqual([[1, 2], [3, 4], [5]]);
    expect(splitArray({ baseArray: [], limit: 2 })).toEqual([]);
    expect(splitArray({ baseArray: [1, 2], limit: 5 })).toEqual([[1, 2]]);
  });
});

describe('removeUndefinedProps and assignDefaultValues (v2)', () => {
  it('removes undefined and keeps null and false', () => {
    const result = removeUndefinedProps({
      a: 1,
      b: undefined,
      c: null,
      d: false,
      e: '',
    });

    expect(result).toEqual({ a: 1, c: null, d: false, e: '' });
  });

  it('assigns default values only when null or undefined', () => {
    const entity = {
      name: 'Item',
      active: undefined as boolean | undefined,
      count: null as number | null,
      existing: 42,
    };

    assignDefaultValues(entity, {
      active: true,
      count: 0,
      existing: 999,
    });

    expect(entity.active).toBe(true);
    expect(entity.count).toBe(0);
    expect(entity.existing).toBe(42);
  });

  it('supports interfaces without explicit index signature', () => {
    interface OrderProps {
      id: string;
      total: number;
      status?: string | null;
      discount?: number;
    }

    const order: OrderProps = {
      id: 'ord_123',
      total: 150,
      status: null,
      discount: undefined,
    };

    assignDefaultValues(order, {
      status: 'PENDING',
      discount: 0,
    });

    expect(order.status).toBe('PENDING');
    expect(order.discount).toBe(0);

    const cleaned = removeUndefinedProps(order);
    expect(cleaned.id).toBe('ord_123');
    expect(cleaned.total).toBe(150);
  });
});

describe('xorEncrypt (v2)', () => {
  it('encrypts and is reversible with the same hash', () => {
    const text = 'SenhaInformática2026';
    const hash = 'SecretKey';

    const encrypted = xorEncrypt({ value: text, hash });
    expect(encrypted).not.toBe(text);

    const decrypted = xorEncrypt({ value: encrypted, hash });
    expect(decrypted).toBe(text);
  });
});

describe('getRandomData (v2)', () => {
  it('generates random string, number, boolean, and picks from options', () => {
    const str = getRandomData('string', { length: 8 });
    expect(str).toHaveLength(8);

    const num = getRandomData('number', { min: 10, max: 20 });
    expect(num).toBeGreaterThanOrEqual(10);
    expect(num).toBeLessThanOrEqual(20);

    const bool = getRandomData('boolean');
    expect(typeof bool).toBe('boolean');

    const picked = getRandomData('random', { options: ['apple', 'banana', 'orange'] });
    expect(['apple', 'banana', 'orange']).toContain(picked);
  });
});

describe('getIPAddress (v2)', () => {
  it('returns valid ipv4 and ipv6 without throwing', () => {
    const ip = getIPAddress();
    expect(ip).toHaveProperty('ipv4');
    expect(ip).toHaveProperty('ipv6');
    expect(typeof ip.ipv4).toBe('string');
    expect(typeof ip.ipv6).toBe('string');
  });
});

describe('v1 compatibility namespace', () => {
  it('exports v1 functions and classes intact', () => {
    expect(v1.getPagination).toBeDefined();
    expect(v1.splitArray).toBeDefined();
    expect(v1.executePromise).toBeDefined();
    expect(v1.FormatCase).toBeDefined();
    expect(v1.FormatText).toBeDefined();
    expect(v1.Exceptions).toBeDefined();
  });
});

describe('WindowsService (v2 & v1)', () => {
  it('throws friendly error when instantiated on non-Windows platforms', () => {
    const originalPlatform = process.platform;
    try {
      Object.defineProperty(process, 'platform', { value: 'linux' });
      expect(() => {
        new WindowsService({
          name: 'test',
          description: 'test',
          script: 'test.js',
        });
      }).toThrow('WindowsService is only supported on Windows platforms.');

      expect(() => {
        new v1.WindowsService({
          name: 'test',
          description: 'test',
          script: 'test.js',
        });
      }).toThrow('WindowsService is only supported on Windows platforms.');
    } finally {
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    }
  });
});
