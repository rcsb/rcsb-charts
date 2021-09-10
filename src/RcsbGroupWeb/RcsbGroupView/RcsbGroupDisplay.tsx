import {Facet, QueryResult} from "@rcsb/rcsb-saguaro-api/build/RcsbSearch/Types/SearchResultInterface";
import * as ReactDom from "react-dom";
import {RcsbChartLayout} from "../../RcsbChartWeb/RcsbChartView/RcsbChartLayout";
import {FacetTools} from "../../RcsbSeacrh/FacetTools";
import React from "react";
import * as classes from "./scss/group-display.module.scss";
import {Container} from "react-bootstrap";
import {SearchQuery} from "@rcsb/rcsb-saguaro-api/build/RcsbSearch/Types/SearchQueryInterface";
import {RcsbGroupMembers} from "./RcsbGroupMembers";
import {FacetStoreInterface} from "../../RcsbSeacrh/FacetStore/FacetStoreInterface";
import {rcsbFvCtxManager} from "../../RcsbFvWeb/RcsbFvBuilder/RcsbFvContextManager";
import {addGroupNodeToSearchQuery, searchGroupQuery} from "../../RcsbSeacrh/QueryStore/SearchGroupQuery";


export class RcsbGroupDisplay {

    public static async displaySearchAttributes(elementId: string, facetStore: FacetStoreInterface, searchQuery?:SearchQuery, groupId?: string): Promise<void>{

        let facets: Array<Facet> = [];
        for(const service of facetStore.getServices()){
            const groupQuery = await searchQuery ? addGroupNodeToSearchQuery(groupId, searchQuery, service) : searchGroupQuery(groupId, service);
            const groupProperties: QueryResult = await rcsbFvCtxManager.getSearchQueryResult(
                groupQuery,
                facetStore.getFacetService(service).map(f => f.facet),
                facetStore.returnType
            );
            facets = facets.concat(groupProperties.drilldown as Facet[]);
        }

        ReactDom.render(
            <div className={classes.bootstrapGroupComponentScope}>
                <Container fluid={"lg"}>
                    <RcsbChartLayout layout={facetStore.facetLayoutGrid} charts={FacetTools.getResultDrilldowns(facetStore.getFacetService("all"), facets)}/>
                </Container>
            </div>,
            document.getElementById(elementId)
        );
    }

    static displayGroupMembers(elementId: string, groupId: string, nMembers: number, query?:SearchQuery){
        ReactDom.render(
            <RcsbGroupMembers groupId={groupId} searchQuery={query} nMembers={nMembers}/>,
            document.getElementById(elementId)
        );
    }

}