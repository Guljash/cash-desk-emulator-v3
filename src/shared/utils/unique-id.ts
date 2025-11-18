/**
 * Создает уникальный идентификатор.
 * Если указан префикс, к нему добавляется идентификатор.
 */
export const uniqueId = ((counter: number) => <P extends string = ''>(prefix: P = '' as P): `${P}${number}` => `${prefix}${++counter}`)(0)
