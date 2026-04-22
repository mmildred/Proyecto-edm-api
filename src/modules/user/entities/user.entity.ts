export class User {
    id: number | undefined;
    name: string | undefined;
    lastname: string | undefined;
    username: string | undefined;
    password?: string | undefined;
    hash?: string | null | undefined;
    created_dt: Date | undefined;
}