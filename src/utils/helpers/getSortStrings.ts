import { PaymentsSortParams } from "../types/sortingParams";

type SortingStrings = {
    sortBy: string;
    order: "ASC" | "DESC";
};

export const getSortingString = (
    sortParams?: PaymentsSortParams,
): SortingStrings => {
    const sortingFields = ["date", "description"];
    if (
        !sortParams ||
        (!sortParams.sortBy && !sortParams.sortOrder) ||
        !sortingFields.includes(sortParams.sortBy)
    ) {
        return { sortBy: "payments.id", order: "ASC" };
    }

    const sortByMappings: Record<string, string> = {
        date: "payments.createdAt",
        description: "payments.description",
    };

    const sortBy =
        sortParams.sortBy in sortByMappings
            ? sortByMappings[sortParams.sortBy]
            : "payments.createdAt";
    const order = sortParams.sortOrder || "DESC";

    return { sortBy, order };
};
