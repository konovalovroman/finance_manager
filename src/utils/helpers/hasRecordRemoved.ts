import { DeleteResult } from "typeorm";

export const hasRecordRemoved = (deleteResult: DeleteResult): boolean => {
    return deleteResult.affected >= 1 ? true : false;
};
