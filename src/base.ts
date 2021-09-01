const UUID_REG = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
export class Base {
    $isValidId(id: string) {
        return UUID_REG.test(id.toString());
    };
}
