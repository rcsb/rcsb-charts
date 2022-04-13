import * as React from "react";
import {RcsbFvModulePublicInterface} from "../RcsbFvModule/RcsbFvModuleInterface";
import {
    FieldName,
    OperationType,
    Source,
} from "@rcsb/rcsb-api-tools/build/RcsbGraphQL/Types/Borrego/GqlTypes";
import {SearchQuery} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";
import {SearchRequestProperty} from "../../RcsbSeacrh/SearchRequestProperty";
import {ReturnType} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {RcsbTabs} from "../WebTools/RcsbTabs";
import {GroupProvenanceId} from "@rcsb/rcsb-api-tools/build/RcsbDw/Types/DwEnums";
import {SelectionInterface} from "@rcsb/rcsb-saguaro/build/RcsbBoard/RcsbSelection";
import {SearchQueryTools as SQT} from "../../RcsbSeacrh/SearchQueryTools";
import {GroupPfvApp as GPA} from "./GroupTabs/GroupPfvApp";

const ALIGNMENT: "alignment" = "alignment";
const STRUCTURAL_FEATURES: "structural-features" = "structural-features";
const BINDING_SITES: "binding-sites" = "binding-sites";
type TabKey = typeof ALIGNMENT|typeof STRUCTURAL_FEATURES|typeof BINDING_SITES;

interface SequenceTabInterface {
    groupProvenanceId: GroupProvenanceId;
    groupId: string;
    searchQuery?: SearchQuery;
}
export class GroupPfvTabs extends React.Component <SequenceTabInterface, null> {

    private readonly featureViewers: Map<TabKey,RcsbFvModulePublicInterface> = new Map<TabKey, RcsbFvModulePublicInterface>();
    private filterInstances: Array<string> = undefined;
    private filterEntities: Array<string> = undefined;
    private entityCount: number = undefined;
    private currentTab: TabKey = ALIGNMENT;

    constructor(props:{groupProvenanceId: GroupProvenanceId, groupId: string, searchQuery: SearchQuery}) {
        super(props);
    }

    render(): JSX.Element {
        return (<>
            <RcsbTabs<TabKey>
                id={"group-id"}
                tabList={[
                    {key: ALIGNMENT, title: "ALIGNMENTS", additionalComponent: this.props.groupProvenanceId === GroupProvenanceId.ProvenanceMatchingUniprotAccession ? <div id={ALIGNMENT+RcsbTabs.SELECT_SUFFIX} /> : undefined},
                    {key: STRUCTURAL_FEATURES, title: "STRUCTURAL FEATURES"},
                    {key: BINDING_SITES, title: "BINDING SITES"}
                ]}
                default={"alignment"}
                onMount={this.onMount.bind(this)}
                onSelect={this.onSelect.bind(this)}
            />
        </>);
    }

    private async onMount() {
        const search: SearchRequestProperty = new SearchRequestProperty();
        if(this.props.searchQuery) {
            this.filterEntities = await search.requestMembers({
                ...this.props.searchQuery,
                query: SQT.addGroupNodeToSearchQuery(this.props.groupProvenanceId, this.props.groupId, this.props.searchQuery.query),
                return_type: ReturnType.PolymerEntity
            });
            this.entityCount = this.filterEntities.length;
            this.filterInstances = await search.requestMembers({
                ...this.props.searchQuery,
                query: SQT.addGroupNodeToSearchQuery(this.props.groupProvenanceId, this.props.groupId, this.props.searchQuery.query),
                return_type: ReturnType.PolymerInstance
            });
            await this.onSelect(this.currentTab);
        }else{
            this.filterInstances = await search.requestMembers({query: SQT.searchGroupQuery(this.props.groupProvenanceId, this.props.groupId), return_type: ReturnType.PolymerInstance});
            this.entityCount = await search.requestCount({query: SQT.searchGroupQuery(this.props.groupProvenanceId, this.props.groupId), return_type: ReturnType.PolymerEntity});
            await this.onSelect(this.currentTab);
        }
    }

    private syncPositionAndHighlight(tabKey: TabKey): void {
        if(tabKey !== this.currentTab){
            const dom: [number,number] = this.featureViewers.get(this.currentTab)?.getFv().getDomain();
            this.featureViewers.get(tabKey).getFv().setDomain(dom);
            const sel: Array<SelectionInterface> = this.featureViewers.get(this.currentTab)?.getFv().getSelection("select");
            if(sel?.length > 0){
                this.featureViewers.get(tabKey).getFv().clearSelection("select");
                this.featureViewers.get(tabKey).getFv().setSelection({
                    elements:sel.map((s)=>({
                        begin:s.rcsbFvTrackDataElement.begin,
                        end:s.rcsbFvTrackDataElement.end
                    })),
                    mode:"select"
                });
            }else{
                this.featureViewers.get(tabKey).getFv().clearSelection("select");
            }
        }
    }

    private async onSelect(tabKey: TabKey): Promise<void> {
        if(!this.featureViewers.has(tabKey))
            await this.renderPositionalFeatureViewer(tabKey);
        this.syncPositionAndHighlight(tabKey);
        this.currentTab= tabKey;
    }

    private async renderPositionalFeatureViewer(tabKey: TabKey): Promise<void> {
        switch (tabKey) {
            case ALIGNMENT:
                this.featureViewers.set(
                    tabKey,
                    await GPA.alignment(
                        tabKey.toString(),
                        this.props.groupProvenanceId,
                        this.props.groupId,
                        this.entityCount,
                        {
                            page:{first:50, after:"0"},
                            alignmentFilter: this.filterEntities
                        }
                    )
                );
                break;
            case BINDING_SITES:
                this.featureViewers.set(
                    tabKey,
                    await GPA.bindingSites(
                        tabKey.toString(),
                        this.props.groupProvenanceId,
                        this.props.groupId,
                        this.filterInstances.length,
                        {
                            page:{first:0,after: "0"},
                            alignmentFilter: this.props.searchQuery ?  this.filterEntities : undefined,
                            filters: this.props.searchQuery ? [{
                                source: Source.PdbInstance,
                                field: FieldName.TargetId,
                                operation: OperationType.Equals,
                                values: this.filterInstances
                            }] : undefined
                        }
                   )
                );
                break;
            case STRUCTURAL_FEATURES:
                this.featureViewers.set(
                    tabKey,
                    await GPA.structure(
                        tabKey.toString(),
                        this.props.groupProvenanceId,
                        this.props.groupId,
                        this.filterInstances.length,
                        {
                            page:{first:0,after: "0"},
                            alignmentFilter: this.props.searchQuery ? this.filterEntities : undefined,
                            filters: this.props.searchQuery ? [{
                                source: Source.PdbInstance,
                                field: FieldName.TargetId,
                                operation: OperationType.Equals,
                                values: this.filterInstances
                            },{
                                source: Source.PdbEntity,
                                field: FieldName.TargetId,
                                operation: OperationType.Equals,
                                values: this.filterEntities
                            }] : undefined
                        }
                    )
                );
                break;
        }
    }

}