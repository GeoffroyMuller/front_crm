import Company from "./company.model"
import type { User } from "core_api/types";
import serviceFactory from "core_api/service"

const companyService = serviceFactory<Company, User>(Company, {
    async onBeforeFetchList({query, auth, filters, data}) {
        if (auth != null) {
            if (auth.idCompany) {
                query.where(Company.tableName + '.idCompany', auth.idCompany);
            }
        }
        return {query, auth, filters, data};
    },
    isAuthorized: async (model: Company | Object, user: User) => {
        return Company.fromJson(model)?.idCompany == user?.idCompany;
    },
    async onBeforeCreate({query, auth, filters, data}) {
        return {
            query, auth, filters,
            data: {
                ...data,
                idCompany: auth?.idCompany
            }
        };
    },
    async onBeforeUpdate({query, auth, filters, data}) {
        return {
            query, auth, filters,
            data: {
                ...data,
                idCompany: auth?.idCompany
            }
        };
    },
    
});

export default companyService;