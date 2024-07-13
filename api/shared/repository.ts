export interface Repository<T> {
    getAll(item: {id?: string}): Promise<T[] | undefined>;
    getOne(item:{id: string, name: string, other: string}): Promise<T | undefined>;
    add(item: T): Promise<T | undefined>;
    update(item: T): Promise<T | undefined>;
    delete(item:{id: string, other: string}): Promise<T | undefined>;
}
