import { describe, expect, it } from 'vitest';
import {
  AppException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  FormatCase,
  FormatText,
  HttpStatusCodes,
  InternalServerException,
  InvalidCredentialsException,
  NotFoundException,
  UnauthorizedException,
  assignDefaultValues,
  capitalize,
  capitalizeText,
  executePromise,
  formatCase,
  formatText,
  generateMetadataResponse,
  getIPAddress,
  getPagination,
  getRandomData,
  isAppException,
  normalize,
  normalizeText,
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
  v1,
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
  it('AppException extends Error and preserves stack trace and prototype', () => {
    const err = new AppException('TEST_ERR', 'Test error message', HttpStatusCodes.BAD_REQUEST, {
      field: 'name',
    });

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppException);
    expect(err.name).toBe('TEST_ERR');
    expect(err.message).toBe('Test error message');
    expect(err.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(err.details).toEqual({ field: 'name' });
    expect(err.stack).toBeDefined();

    const json = err.toJSON();
    expect(json.status).toBe(400);
    expect(json.name).toBe('TEST_ERR');

    expect(isAppException(err)).toBe(true);
    expect(isAppException(new Error('regular error'))).toBe(false);
  });

  it('subclasses of AppException correctly inherit status and codes', () => {
    const badRequest = new BadRequestException({ message: 'Invalid data' });
    expect(badRequest).toBeInstanceOf(Error);
    expect(badRequest).toBeInstanceOf(AppException);
    expect(badRequest.status).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(badRequest.message).toBe('Invalid data');

    const notFound = new NotFoundException();
    expect(notFound.status).toBe(HttpStatusCodes.NOT_FOUND);
    expect(notFound.message).toBe('Não encontrado');

    const unauthorized = new UnauthorizedException();
    expect(unauthorized.status).toBe(HttpStatusCodes.UNAUTHORIZED);

    const internal = new InternalServerException();
    expect(internal.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);

    const forbidden = new ForbiddenException();
    expect(forbidden.status).toBe(HttpStatusCodes.FORBIDDEN);

    const conflict = new ConflictException();
    expect(conflict.status).toBe(HttpStatusCodes.CONFLICT);

    const invalidCreds = new InvalidCredentialsException();
    expect(invalidCreds.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    expect(invalidCreds.message).toBe('Usuário ou senha incorretos');
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
    expect(error).toBe('(404 - SI_NOT_FOUND) User not found');
    expect(rawError).toBe(appErr);
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
