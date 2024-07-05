export interface Repository<T> {
    getAll(): Promise<T[] | undefined>;
    getOne(item:{id: string}): Promise<T | undefined>;
    add(item: T): Promise<T | undefined>;
    update(item: T): Promise<T | undefined>;
    delete(item:{id: string}): Promise<T | undefined>;
}
