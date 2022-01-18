import {SearchQueryType} from "../SearchRequestProperty";
import {LogicalOperator, Service, Type} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {SearchQuery} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";

export function searchGroupQuery(groupId:string, service?: Service): SearchQueryType {
    return {
        type: Type.Terminal,
        service: service ?? Service.Text,
        parameters: {
            attribute: RcsbSearchMetadata.RcsbPolymerEntityGroupMembership.GroupId.path,
            negation: false,
            operator: RcsbSearchMetadata.RcsbPolymerEntityGroupMembership.GroupId.operator.ExactMatch,
            value: groupId
        }
    }
}

export function addGroupNodeToSearchQuery(groupId: string, searchQuery: SearchQuery, service?: Service): SearchQueryType {
    return {
        type: Type.Group,
        logical_operator: LogicalOperator.And,
        nodes: [
            searchGroupQuery(groupId, service),
            searchQuery.query
        ]
    }
}